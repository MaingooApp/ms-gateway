import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import type { CurrentUser } from 'src/common';
import { AnalyzerSubjects, NATS_SERVICE, envs } from 'src/config';
import type { SubmitInvoiceDto } from './dto';

interface SubmitPayload {
  buffer: string;
  filename: string;
  mimetype: string;
  notes?: string;
  enterpriseId?: string;
  uploadedBy: string;
}

@Injectable()
export class AnalyzeService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  submit(file: Express.Multer.File | undefined, body: SubmitInvoiceDto, user: CurrentUser) {
    if (!file) {
      throw new UnprocessableEntityException('File is required');
    }

    const payload: SubmitPayload = {
      buffer: file.buffer.toString('base64'),
      filename: file.originalname,
      mimetype: file.mimetype,
      notes: body.notes,
      enterpriseId: user.enterpriseId,
      uploadedBy: user.userId,
    };

    return this.send(AnalyzerSubjects.submit, payload);
  }

  getById(id: string, user: CurrentUser) {
    return this.send(AnalyzerSubjects.getById, {
      id,
      enterpriseId: user.enterpriseId,
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
