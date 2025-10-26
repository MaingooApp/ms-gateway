import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { EnterprisesSubjects, NATS_SERVICE, envs } from 'src/config';
import { CreateEnterpriseDto, UpdateEnterpriseDto } from './dto';

@Injectable()
export class EnterprisesService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async create(dto: CreateEnterpriseDto) {
    return this.send(EnterprisesSubjects.create, dto);
  }

  async findAll() {
    return this.send(EnterprisesSubjects.findAll, {});
  }

  async findOne(id: string) {
    return this.send(EnterprisesSubjects.findOne, { id });
  }

  async update(id: string, dto: UpdateEnterpriseDto) {
    return this.send(EnterprisesSubjects.update, { id, ...dto });
  }

  async remove(id: string) {
    return this.send(EnterprisesSubjects.delete, { id });
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
