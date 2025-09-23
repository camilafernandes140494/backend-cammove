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
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { SchedulesData } from './schedule.types';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('teachers/:teacherId')
  async createSchedules(
    @Param('teacherId') teacherId: string,
    @Body() schedulesData: SchedulesData,
  ) {
    return await this.scheduleService.createSchedules(teacherId, schedulesData);
  }

  @Get('teachers/:teacherId')
  @HttpCode(HttpStatus.OK)
  async getSchedules(@Param('teacherId') teacherId: string) {
    return await this.scheduleService.getSchedules(teacherId);
  }

  @Get('teachers/:teacherId/dates')
  @HttpCode(HttpStatus.OK)
  async getScheduleDates(@Param('teacherId') teacherId: string) {
    return await this.scheduleService.getScheduleDates(teacherId);
  }

  @Get('teachers/:teacherId/students/:studentId/dates')
  @HttpCode(HttpStatus.OK)
  async getScheduleDatesByStudent(
    @Param('teacherId') teacherId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.scheduleService.getScheduleDatesByStudent(
      teacherId,
      studentId,
    );
  }

  @Get('teachers/:teacherId/schedules/:scheduleId')
  @HttpCode(HttpStatus.OK)
  async getSchedulesById(
    @Param('teacherId') teacherId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    return await this.scheduleService.getSchedulesById(teacherId, scheduleId);
  }

  @Patch('teachers/:teacherId/schedules/:scheduleId')
  @HttpCode(HttpStatus.OK)
  async updateSchedules(
    @Param('scheduleId') scheduleId: string,
    @Param('teacherId') teacherId: string,
    @Body() updateData: Partial<SchedulesData>,
  ) {
    return await this.scheduleService.updateSchedules(
      teacherId,
      scheduleId,
      updateData,
    );
  }

  @Delete('teachers/:teacherId/schedules/:scheduleId/delete')
  @HttpCode(HttpStatus.OK)
  async deleteSchedules(
    @Param('teacherId') teacherId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    return await this.scheduleService.deleteSchedules(teacherId, scheduleId);
  }
}
