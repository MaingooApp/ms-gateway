import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import type { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { AnalyzeService } from './analyze.service';
import { AuthGuard } from 'src/common/guards';
import { GetDocumentParams, SubmitInvoiceDto } from './dto';
import { User } from 'src/common';
import type { CurrentUser } from 'src/common';

@Controller('analyze')
@UseGuards(AuthGuard)
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post('invoice')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  submitInvoice(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: SubmitInvoiceDto,
    @User() user: CurrentUser,
  ) {
    return this.analyzeService.submit(file, body, user);
  }

  @Get(':id')
  getById(@Param() params: GetDocumentParams, @User() user: CurrentUser) {
    return this.analyzeService.getById(params.id, user);
  }
}
