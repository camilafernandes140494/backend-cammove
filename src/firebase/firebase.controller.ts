import { Controller, Get, Post, Body } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // Endpoint para criar um post
  @Post('createPost')
  async createPost(@Body() post: any) {
    return this.firebaseService.createPost(post);
  }

  // Endpoint para obter todos os posts
  @Get('getPosts')
  async getPosts() {
    return this.firebaseService.getPosts();
  }
}
