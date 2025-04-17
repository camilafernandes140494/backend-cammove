import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Get,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // Endpoint para criar um review
  @Post('students/:studentId')
  async logTrainingDay(@Param('studentId') studentId: string) {
    return this.scheduleService.logTrainingDay(studentId);
  }

  // Endpoint para listar todos os reviews de um professor
  @Get('students/:studentId')
  @HttpCode(HttpStatus.OK)
  async getTrainingDays(@Param('studentId') studentId: string) {
    return this.scheduleService.getTrainingDays(studentId);
  }
}
