import {
  Body,
  Controller, HttpCode,
  HttpStatus, Post,
  UseGuards
} from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { WorkoutSuggestionData } from './openai.types';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('ai')

export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

    @Post('workouts')
    @HttpCode(HttpStatus.CREATED)
    async createWorkout(
      @Body() workoutData: WorkoutSuggestionData,
    ) {
     const treino = await this.openAiService.workoutSuggestion(workoutData);
     console.log(treino)
     return { treino };
    }

    


  // @Get(':folder/:key')
  // async getImage(@Param('folder') folder: string, @Param('key') key: string) {
  //   const url = await this.openAiService.getPublicUrl(folder, key);
  //   return { url };
  // }

  // @Delete(':folder/:key')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteImage(
  //   @Param('folder') folder: string,
  //   @Param('key') key: string,
  // ) {
  //   await this.openAiService.deleteFile(folder, key);
  //   // 204 No Content não retorna body
  // }

  // @Post(':folder/upload/video')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadVideo(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('folder') folder: string,
  // ) {
  //   return this.openAiService.uploadVideo(file, folder || 'videos');
  // }
}
