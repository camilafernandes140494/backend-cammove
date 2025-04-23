import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Body,
  Patch,
  Delete,
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

  @Get('teachers/:teacherId/dates')
  @HttpCode(HttpStatus.OK)
  async getScheduleDates(@Param('teacherId') teacherId: string) {
    return this.scheduleService.getScheduleDates(teacherId);
  }

  @Get('teachers/:teacherId/schedules/:scheduleId')
  @HttpCode(HttpStatus.OK)
  async getSchedulesById(
    @Param('teacherId') teacherId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    return this.scheduleService.getSchedulesById(teacherId, scheduleId);
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

  @Delete('teachers/:teacherId/schedules/:scheduleId/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedules(
    @Param('teacherId') teacherId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    await this.scheduleService.deleteSchedules(teacherId, scheduleId);
  }
}
