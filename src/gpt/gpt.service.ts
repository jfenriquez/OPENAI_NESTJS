import { Injectable, NotFoundException } from '@nestjs/common';

import { orthographyUseCase } from './use-cases/orthography.use-case';
import { OrthographyDto } from './dto/orthography.dto';
import OpenAI from 'openai';
import { ProsConsDiscusserDto } from './dto/ProsConsDiscusser.dto';
import { prosConsDicusserUseCase } from './use-cases/prosConsDicusser.use-case';
import { prosConsDicusserStreamUseCase } from './use-cases/prosConsDicusserStream.use-case';
import { TranslateDto } from './dto/translate.dto';
import { translateUseCase } from './use-cases/translate.use-case';
import { TextToAudioDto } from './dto/textToAudio.dto';
import { textToAudioUseCase } from './use-cases/textToAudio.use-case';
import * as path from 'path';
import * as fs from 'fs';
import { audioToTextUseCase } from './use-cases/AudioToText.use-case';
import { ImageGenerationDto } from './dto/image-generation.dto';
import { imageGenerationUseCase } from './use-cases/imageGeneration.use-case';
import { ImagenVariationDto } from './dto/image-variation.dto';
import { imageVariationUseCase } from './use-cases/imageVariationUseCase';

@Injectable()
export class GptService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  async ortographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    try {
      return await prosConsDicusserUseCase(this.openai, {
        prompt: prosConsDiscusserDto.prompt,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async prosConsDicusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    try {
      return await prosConsDicusserStreamUseCase(this.openai, {
        prompt: prosConsDiscusserDto.prompt,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async transladeText(translateDto: TranslateDto) {
    try {
      return await translateUseCase(this.openai, {
        prompt: translateDto.prompt,
        lang: translateDto.lang,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async textToAudioFile(fileID: string) {
    const folderPath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileID}.mp3`,
    );
    const wasFile = fs.existsSync(folderPath);
    if (!wasFile) {
      throw new NotFoundException(`file id ${fileID} not found`);
    }
    return await folderPath;
  }

  async AudioTotext(audioFile: Express.Multer.File, AudioToTextDto) {
    const { prompt } = AudioToTextDto;
    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }

  /////IMAGEN
  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return imageGenerationUseCase(this.openai, imageGenerationDto);
  }

  async ImagenFile(fileID: string) {
    const folderPath = path.resolve(
      __dirname,
      '../../generated/images/',
      `${fileID}.png`,
    );
    const wasFile = fs.existsSync(folderPath);
    if (!wasFile) {
      throw new NotFoundException(`file id ${fileID} not found`);
    }
    return await folderPath;
  }

  async imagenVariation({ baseImage }: ImagenVariationDto) {
    return await imageVariationUseCase(this.openai, { baseImage });
  }
}
