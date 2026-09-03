import fs from 'fs';
import https from 'https';

// A video where the camera is completely STILL (on a tripod). 
// No zooming, no panning. When it loops, it's almost perfectly seamless.
const url = "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4";

console.log("Downloading seamless static camera video...");
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  const fileStream = fs.createWriteStream('./public/hero.mp4');
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    console.log('SUCCESS: Seamless video downloaded to public/hero.mp4!');
  });
});
