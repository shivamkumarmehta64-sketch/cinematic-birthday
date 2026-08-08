'use client';

export type BirthdayData = {
  name: string;
  message: string;
  photos: string[];
};

// Default message used when no custom one is given.
export const DEFAULT_MESSAGE = `Happiest birthday my gurl 😍✨

I pray you achieve all your dreams, stay happy, and keep smiling the way you do... because that smile is my favorite thing ❤️

Everyday is your day because you are the main character... and YOU KNOW IT 😎

Let's share unlimited laughs, love, fights, and happiness 🌈

I love you forever and ever and ever 💕

Thankyou for being my partner in every sense, happy 19th darlzzz 🎂❤️😍

Please be with me chelloo 🥹💘`;

export const DEFAULT_NAME = 'My Girl';

// Classic site default: the 13 photos already shipped with the app.
export const DEFAULT_PHOTOS: string[] = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg',
  '/images/image4.jpg',
  '/images/image5.jpg',
  '/images/image6.jpg',
  '/images/image7.jpg',
  '/images/image8.jpg',
  '/images/image9.jpg',
  '/images/image10.jpg',
  '/images/image11.jpg',
  '/images/image13.jpg',
];

export const DEFAULT_DATA: BirthdayData = {
  name: DEFAULT_NAME,
  message: DEFAULT_MESSAGE,
  photos: DEFAULT_PHOTOS,
};

// --- URL-safe packing (base64url of UTF-8 JSON) ---------------------------

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

import { shrinkImage } from './image';

export function pack(data: BirthdayData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const combo = (b0 << 16) | (b1 << 8) | b2;
    bin += B64_CHARS[(combo >> 18) & 63];
    bin += B64_CHARS[(combo >> 12) & 63];
    bin += i + 1 < bytes.length ? B64_CHARS[(combo >> 6) & 63] : '=';
    bin += i + 2 < bytes.length ? B64_CHARS[combo & 63] : '=';
  }
  return bin;
}

export function unpack(packed: string): BirthdayData {
  const pad = packed.replace(/[=]$/, '');
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of pad) {
    const idx = B64_CHARS.indexOf(ch);
    if (idx < 0) continue;
    buffer = (buffer << 6) | idx;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }
  const json = new TextDecoder().decode(new Uint8Array(bytes));
  try {
    const parsed = JSON.parse(json) as Partial<BirthdayData>;
    return {
      name: typeof parsed.name === 'string' ? parsed.name : DEFAULT_NAME,
      message: typeof parsed.message === 'string' ? parsed.message : DEFAULT_MESSAGE,
      photos: Array.isArray(parsed.photos) ? parsed.photos.map(String).filter(Boolean) : DEFAULT_PHOTOS,
    };
  } catch {
    return DEFAULT_DATA;
  }
}

// Pack a data for URL sharing: photos are shrunk to keep the URL short.
export async function packShareable(data: BirthdayData, maxPhotos = 6): Promise<BirthdayData> {
  const photos: string[] = [];
  for (const src of data.photos.slice(0, maxPhotos)) {
    try {
      photos.push(await shrinkImage(src, 320, 0.55));
    } catch {
      photos.push(src);
    }
  }
  return { name: data.name, message: data.message, photos };
}

export function shareUrl(data: BirthdayData): string {
  return `${location.origin}/experience?d=${encodeURIComponent(pack(data))}`;
}