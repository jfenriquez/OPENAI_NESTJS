import OpenAI from 'openai';
import { downloadsImageAsPng } from 'src/helpers/downloads-image-as-png';

import * as fs from 'fs';
interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;
  /////descargar imagen
  const pngImagePath = await downloadsImageAsPng(baseImage, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileNameNewImg = await downloadsImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileNameNewImg}`;

  return {
    url: url,
    openAIPath: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
