import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import { AuthSubjects, NATS_SERVICE, envs } from 'src/config';
import { CurrentUser } from 'src/common';
import { LoginUserDto, RefreshTokenDto, RegisterUserDto, UpdateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async register(body: RegisterUserDto) {
    return this.send(AuthSubjects.register, body);
  }

  async getRoles() {
    return this.send(AuthSubjects.getRoles, {});
  }
  login(body: LoginUserDto) {
    return this.send(AuthSubjects.login, body);
  }

  refresh(body: RefreshTokenDto) {
    return this.send(AuthSubjects.refresh, body);
  }

  profile(user: CurrentUser) {
    return this.send(AuthSubjects.profile, {
      userId: user.userId,
      enterpriseId: user.enterpriseId,
    });
  }

  updateUser(userId: string, enterpriseId: string, data: UpdateUserDto) {
    return this.send(AuthSubjects.userUpdate, {
      userId,
      enterpriseId,
      data,
    });
  }

  private async send<T>(subject: string, payload: unknown): Promise<T> {
    const observable = this.client.send<T>(subject, payload).pipe(
      timeout(envs.requestTimeoutMs),
      catchError((error) => {
        throw new RpcException(error);
      }),
    );

    return await firstValueFrom(observable);
  }
}
