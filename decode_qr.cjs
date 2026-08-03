const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const jsQR = require('jsqr');

const imgPath = 'C:\\Users\\rudra\\.gemini\\antigravity-ide\\brain\\cc011220-5115-474b-9f25-49d050b76cc6\\media__1784783458004.jpg';
const jpegData = fs.readFileSync(imgPath);
const rawImageData = jpeg.decode(jpegData, { useTolerantUnknown: true });

const code = jsQR(new Uint8ClampedArray(rawImageData.data), rawImageData.width, rawImageData.height);

if (code) {
  console.log('=== DECODED UPI QR STRING ===');
  console.log(code.data);
  console.log('=============================');
} else {
  console.log('Could not decode QR code.');
}
