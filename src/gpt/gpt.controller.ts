import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { GptService } from './gpt.service';

import { OrthographyDto } from './dto/orthography.dto';
import { ProsConsDiscusserDto } from './dto/ProsConsDiscusser.dto';
import type { Response } from 'express';
import { TranslateDto } from './dto/translate.dto';
import { TextToAudioDto } from './dto/textToAudio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AudioToTextDto } from './dto/audio-to-text.dto';
import { ImageGenerationDto } from './dto/image-generation.dto';
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('ortography_check')
  ortographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.ortographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }
  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.transladeText(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    await res.sendFile(filePath);
  }

  @Get('text-to-audiogetter/:fileID')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileID') fileID: string,
  ) {
    const filePath = await this.gptService.textToAudioFile(fileID);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    await res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExt = file.originalname.split('.').pop();
          const filename = `${new Date().getTime()}.${fileExt}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async AudioTotext(
    @Body('prompt') prompt: AudioToTextDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 10,
            message: 'File too large',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.gptService.AudioTotext(file, prompt);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileID')
  async imageGenerationGetter(
    @Param('fileID') fileID: string,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.ImagenFile(fileID);
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    await res.sendFile(filePath);
  }
}
