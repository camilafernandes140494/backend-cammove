// termsOfUse.controller.ts
import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
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
  @Post()
  @HttpCode(HttpStatus.OK)
  async createTermsOfUse() {
    return this.termsOfUseService.createTermsOfUse();
  }
}
