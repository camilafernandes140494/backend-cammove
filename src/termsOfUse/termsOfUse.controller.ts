// termsOfUse.controller.ts
import {
  Controller,
  HttpCode,
  HttpStatus,
  Get, Put,
  UseGuards
} from '@nestjs/common';
import { TermsOfUseService } from './termsOfUse.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('terms-of-use')
export class TermsOfUseController {
  constructor(
    private readonly termsOfUseService: TermsOfUseService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getActiveTermsOfUse() {
    return this.termsOfUseService.getActiveTermsOfUse();
  }

  @UseGuards(AuthGuard)
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async getAllTermsOfUse() {
    return this.termsOfUseService.getAllTermsOfUse();
  }

  @UseGuards(AuthGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateTermsOfUse() {
    return this.termsOfUseService.updateTermsOfUse();
  }
}
