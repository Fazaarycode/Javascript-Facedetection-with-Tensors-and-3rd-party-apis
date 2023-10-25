import * as faceapi from 'face-api.js';

import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';

async function run() {

  await faceDetectionNet.loadFromDisk('../models')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('../models')

  const img = await canvas.loadImage('../images/bbt1.jpg')
  const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks()

  const out = faceapi.createCanvasFromMedia(img) as any
  faceapi.draw.drawDetections(out, results.map(res => res.detection))
  faceapi.draw.drawFaceLandmarks(out, results.map(res => res.landmarks))

  saveFile('faceLandmarkDetection.jpg', out.toBuffer('image/jpeg'))
  console.log('done, saved results to out/faceLandmarkDetection.jpg')
}

run()