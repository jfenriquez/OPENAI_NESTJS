import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';
import { url } from 'inspector';
import { downloadsImageAsPng } from 'src/helpers/downloads-image-as-png';
interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  const response = await openai.images.generate({
    prompt: prompt,
    model: 'dall-e-3',
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });
  /////guardar imagen
  await downloadsImageAsPng(response.data[0].url);

  return {
    url: response.data[0].url,
    localPath: '',
    revised_prompt: response.data[0].revised_prompt,
  };
};
