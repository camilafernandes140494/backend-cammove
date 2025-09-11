// termsOfUse.controller.ts
import {
  Controller,
  HttpCode,
  HttpStatus,
  Get, Put
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

  @Get("all")
  @HttpCode(HttpStatus.OK)
  async getAllTermsOfUse() {
    return this.termsOfUseService.getAllTermsOfUse();
  }
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateTermsOfUse() {
    return this.termsOfUseService.updateTermsOfUse();
  }
}
