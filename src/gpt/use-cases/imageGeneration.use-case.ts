import { response } from 'express';
import OpenAI from 'openai';
import { downloadBase64ImageAsPng } from 'src/helpers/download-image-base-64';

import { downloadsImageAsPng } from 'src/helpers/downloads-image-as-png';
import * as fs from 'fs';
import path from 'path';

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

  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });
    /////guardar imagen
    const fileName = await downloadsImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
    return {
      url: url, /////ingresar tambien la url de la imagen
      openAIPath: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  ///
  const pngImagePath = await downloadsImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);
  const response = await openai.images.edit({
    model: 'dall-e-3',
    prompt: prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const localImagePath = await downloadsImageAsPng(response.data[0].url);
  const fileName = path.basename(localImagePath);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url: url,
    openAIPath: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
