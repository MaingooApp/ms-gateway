import {
  Inject,
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { AuthSubjects, NATS_SERVICE, envs } from 'src/config';

interface VerifyResponse {
  user: {
    id: string;
    email?: string;
    roleName?: string; // Cambiado de role a roleName que es lo que devuelve auth
    enterpriseId?: string;
  };
  token?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request?.headers?.authorization);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const response = await this.fetchVerification(token);

    request.user = {
      userId: response.user.id,
      email: response.user.email,
      role: response.user.roleName, // Mapear roleName a role
      enterpriseId: response.user.enterpriseId,
      claims: {
        userId: response.user.id,
        role: response.user.roleName, // Mapear roleName a role
        enterpriseId: response.user.enterpriseId,
      },
    };
    request.token = response.token ?? token;

    return true;
  }

  private async fetchVerification(token: string): Promise<VerifyResponse> {
    try {
      const response = await firstValueFrom(
        this.client
          .send<VerifyResponse>(AuthSubjects.verify, { token })
          .pipe(timeout(envs.requestTimeoutMs)),
      );

      if (!response || !response.user) {
        throw new UnauthorizedException('Invalid token');
      }

      return response;
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? ((error as { message?: string }).message ?? 'Invalid token')
          : 'Invalid token';
      throw new UnauthorizedException(message);
    }
  }

  private extractToken(authorization?: string): string | undefined {
    const [scheme, value] = authorization?.split(' ') ?? [];
    if (scheme?.toLowerCase() !== 'bearer') {
      return undefined;
    }
    return value;
  }
}
