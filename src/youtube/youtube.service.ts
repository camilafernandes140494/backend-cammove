import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class YoutubeService {
  private oAuth2Client;

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    this.oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  async uploadVideo(filePath: string, title: string, description: string): Promise<string> {
    const youtube = google.youtube({
      version: 'v3',
      auth: this.oAuth2Client,
    });

    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'unlisted', // public | private | unlisted
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    return `https://www.youtube.com/watch?v=${res.data.id}`;
  }
}
