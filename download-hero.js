import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const pexelsKey = envFile.split('\n').find(line => line.startsWith('VITE_PEXELS_KEY=')).split('=')[1].trim();

async function download() {
  try {
    console.log("Searching Pexels for a crystal clear cinematic video...");
    const res = await fetch('https://api.pexels.com/videos/search?query=beautiful+cinematic+ocean+waves&per_page=1', {
      headers: { Authorization: pexelsKey }
    });
    
    const json = await res.json();
    const videoFiles = json.videos[0].video_files;
    
    // Sort by width descending to get the highest resolution (1080p or 4K)
    videoFiles.sort((a, b) => b.width - a.width);
    
    // Pick the highest resolution file to guarantee it is NOT blurry
    const fileObj = videoFiles[0]; 
    const videoUrl = fileObj.link;

    console.log(`Found crystal clear video link (${fileObj.width}x${fileObj.height}). Downloading...`);
    const vidRes = await fetch(videoUrl);
    
    if (!vidRes.ok) throw new Error("Failed to fetch video data");
    
    const arrayBuffer = await vidRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync('./public/hero.mp4', buffer);
    console.log(`SUCCESS! Video saved perfectly. File size is: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
  } catch (err) {
    console.error("Error:", err);
  }
}

download();
