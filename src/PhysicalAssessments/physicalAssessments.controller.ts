import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { PhysicalAssessmentsService } from './physicalAssessments.service';
import { PhysicalAssessmentData } from './physicalAssessments.types';
@Controller('physical-assessment')
export class PhysicalAssessmentsController {
  constructor(
    private readonly physicalAssessmentsService: PhysicalAssessmentsService,
  ) {}

  // Endpoint para cadastrar avaliação física
  @Post('relationships/:relationshipId')
  @HttpCode(HttpStatus.CREATED)
  async createPhysicalAssessment(
    @Param('relationshipId') relationshipIdId: string,
    @Body()
    assessmentData: PhysicalAssessmentData,
  ) {
    const createdAt = new Date().toISOString();
    return this.physicalAssessmentsService.createPhysicalAssessment(
      relationshipIdId,
      assessmentData,
      createdAt,
    );
  }

  // Endpoint para atualizar avaliação física
  @Patch('relationships/:relationshipId')
  @HttpCode(HttpStatus.OK)
  async updatePhysicalAssessment(
    @Param('relationshipId') relationshipIdId: string,
    @Body() assessmentData: PhysicalAssessmentData,
  ) {
    const updatedAt = new Date().toISOString();
    try {
      return await this.physicalAssessmentsService.updatePhysicalAssessment(
        relationshipIdId,
        assessmentData,
        updatedAt,
      );
    } catch (error) {
      throw new Error('Erro ao atualizar avaliação física: ' + error.message);
    }
  }

  // Endpoint para excluir avaliação física
  @Delete('relationships/:relationshipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePhysicalAssessment(
    @Param('relationshipId') relationshipIdId: string,
  ) {
    try {
      return await this.physicalAssessmentsService.deletePhysicalAssessment(
        relationshipIdId,
      );
    } catch (error) {
      throw new Error('Erro ao excluir avaliação física: ' + error.message);
    }
  }
}
