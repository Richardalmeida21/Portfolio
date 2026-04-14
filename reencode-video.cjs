const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const inputVideo = path.join(__dirname, 'public', 'Video_Optimized.mp4');
const outputVideo = path.join(__dirname, 'public', 'Video_Fluid.mp4');

console.log('Iniciando re-encode do vídeo...');
console.log('Input:', inputVideo);
console.log('Output:', outputVideo);

ffmpeg(inputVideo)
  .videoCodec('libx264')
  .addOption('-preset', 'fast')
  .addOption('-crf', '23')
  // Force keyframe every frame for smooth seeking
  .addOption('-g', '1')
  .addOption('-keyint_min', '1')
  .addOption('-sc_threshold', '0')
  // Fast decode for better scrubbing performance
  .addOption('-tune', 'fastdecode')
  // Set profile for compatibility
  .addOption('-profile:v', 'main')
  .addOption('-level', '4.0')
  .on('progress', function(progress) {
    console.log('Progresso: ' + (progress.percent ? progress.percent.toFixed(1) : '0') + '%');
  })
  .on('end', function() {
    console.log('✅ Re-encode concluído com sucesso!');
    console.log('Vídeo salvo em:', outputVideo);
  })
  .on('error', function(err) {
    console.log('❌ Erro no re-encode:', err.message);
  })
  .save(outputVideo);
