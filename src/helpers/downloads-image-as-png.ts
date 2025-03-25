import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

export const downloadsImageAsPng = async (
  url: string,
  fullPath: boolean = false,
) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`);
  }

  const folderPath = path.resolve('./', './generated/images');
  fs.mkdirSync(folderPath, { recursive: true });
  const imageNamePng = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  //fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);

  const completePath = path.join(folderPath, imageNamePng);
  await sharp(buffer).png().ensureAlpha().toFile(completePath);
  return fullPath ? completePath : imageNamePng;
};
