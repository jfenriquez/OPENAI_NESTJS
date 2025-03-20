import * as path from 'path';
import * as fs from 'fs';

export const downloadsImageAsPng = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`);
  }

  const folderPath = path.resolve('./', './generated/images');
  fs.mkdirSync(folderPath, { recursive: true });
  const imageNamePng = `${Date.now()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);
};
