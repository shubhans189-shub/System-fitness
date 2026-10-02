import fs from 'node:fs';
import zlib from 'node:zlib';

// Minimal PNG encoder in pure Node.js using built-in zlib
function createPNG(width, height, drawPixel) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    rawData[rowStart] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowStart + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(len + 12);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// Drawing function for Solo Leveling System icon
function soloLevelingPainter(isMaskable = false) {
  return (x, y, w, h) => {
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    const dist = Math.sqrt(nx * nx + ny * ny);

    // Deep void background
    let r = 5, g = 8, b = 20, a = 255;

    // Glowing cyan/blue aura in center
    if (dist < 0.85) {
      const aura = Math.max(0, 1 - dist);
      r = Math.min(255, Math.floor(r + 10 * aura));
      g = Math.min(255, Math.floor(g + 60 * aura));
      b = Math.min(255, Math.floor(b + 140 * aura));
    }

    // System frame box
    const inBox = Math.abs(nx) < 0.72 && Math.abs(ny) < 0.72;
    const onBoxBorder = inBox && (Math.abs(Math.abs(nx) - 0.70) < 0.03 || Math.abs(Math.abs(ny) - 0.70) < 0.03);
    if (onBoxBorder) {
      r = 56; g = 189; b = 248; // #38bdf8 cyan
    }

    // Central Sword / Dagger / Level mark
    // Blade
    const bladeY = ny;
    const bladeX = Math.abs(nx);
    if (bladeY > -0.55 && bladeY < 0.35) {
      const expectedHalfW = 0.04 + Math.max(0, 0.35 - bladeY) * 0.04;
      if (bladeX < expectedHalfW) {
        // Blade core
        r = 224; g = 242; b = 254; // #e0f2fe
        if (bladeX > expectedHalfW * 0.6) {
          r = 56; g = 189; b = 248;
        }
      }
    }

    // Crossguard
    if (bladeY >= 0.28 && bladeY <= 0.35 && bladeX < 0.22) {
      r = 14; g = 165; b = 233;
    }

    // Hilt / Pommel
    if (bladeY > 0.35 && bladeY < 0.52 && bladeX < 0.04) {
      r = 15; g = 23; b = 42;
    }
    if (bladeY >= 0.50 && bladeY <= 0.55 && bladeX < 0.08) {
      r = 56; g = 189; b = 248;
    }

    return [r, g, b, a];
  };
}

// Generate files
const sizes = [
  { name: 'public/pwa-192x192.png', size: 192, maskable: false },
  { name: 'public/pwa-512x512.png', size: 512, maskable: false },
  { name: 'public/pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'public/apple-touch-icon.png', size: 180, maskable: false },
  { name: 'public/favicon.ico', size: 64, maskable: false },
];

for (const { name, size, maskable } of sizes) {
  const buf = createPNG(size, size, soloLevelingPainter(maskable));
  fs.writeFileSync(name, buf);
  console.log(`Generated ${name} (${size}x${size})`);
}
