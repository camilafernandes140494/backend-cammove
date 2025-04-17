import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Body,
  Patch,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { SchedulesData } from './schedule.types';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('teachers/:teacherId')
  async createSchedules(
    @Param('teacherId') teacherId: string,
    @Body() schedulesData: SchedulesData,
  ) {
    return this.scheduleService.createSchedules(teacherId, schedulesData);
  }

  @Get('teachers/:teacherId')
  @HttpCode(HttpStatus.OK)
  async getSchedules(@Param('teacherId') teacherId: string) {
    return this.scheduleService.getSchedules(teacherId);
  }

  @Patch('teachers/:teacherId/schedules/:scheduleId')
  @HttpCode(HttpStatus.OK)
  async updateSchedules(
    @Param('scheduleId') scheduleId: string,
    @Param('teacherId') teacherId: string,
    @Body() updateData: Partial<SchedulesData>,
  ) {
    return this.scheduleService.updateSchedules(
      teacherId,
      scheduleId,
      updateData,
    );
  }
}
