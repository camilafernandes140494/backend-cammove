// termsOfUse.controller.ts
import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { TermsOfUseService } from './termsOfUse.service';

@Controller('terms-of-use')
export class TermsOfUseController {
  constructor(
    private readonly termsOfUseService: TermsOfUseService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getActiveTermsOfUse() {
    return this.termsOfUseService.getActiveTermsOfUse();
  }
}
