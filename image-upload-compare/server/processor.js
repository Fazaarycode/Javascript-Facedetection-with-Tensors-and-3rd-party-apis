import '@tensorflow/tfjs-node'
import sharp from 'sharp'
import express from 'express'
import faceapi from 'face-api.js'

import { canvas, faceDetectionNet } from './utilities/index.js'

import { faceDetectionOptions } from './utilities/index.js'

const app = express();

import fs from 'fs'

faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData });

function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

async function processAndDetectFaces(imageBuffer) {
  // Load models for face detection
  // const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)



  await faceDetectionNet.loadFromDisk('../models')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('../models')
  await faceapi.nets.faceRecognitionNet.loadFromDisk('../models')

  const referenceImage = await canvas.loadImage('./uploads/blur11.png')
  const queryImage = await canvas.loadImage('./uploads/blur22.png')


  const resultsRef = await faceapi.detectAllFaces(referenceImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors()

  // const resultsQuery = await faceapi.detectAllFaces(queryImage, faceDetectionOptions)
    // .withFaceLandmarks()
    // .withFaceDescriptors()

  // const faceMatcher = new faceapi.FaceMatcher(resultsRef)

  // const labels = faceMatcher.labeledDescriptors
  //   .map(ld => ld.label)
  // const refDrawBoxes = resultsRef
  //   .map(res => res.detection.box)
  //   .map((box, i) => new faceapi.draw.DrawBox(box, { label: labels[i] }))
  // const outRef = faceapi.createCanvasFromMedia(referenceImage)
  // refDrawBoxes.forEach(drawBox => drawBox.draw(outRef))

  // // Load and process the image using sharp
  // const image = sharp(imageBuffer);

  // // Detect faces
  // const faceDetectionOptions = new faceapi.TinyFaceDetectorOptions();
  // const detectedFaces = await faceapi.detectAllFaces(imageBuffer, faceDetectionOptions);

  // // Process each detected face
  // for (const face of detectedFaces) {
  //   // Enhance image quality if needed
  //   if (face.detection._score < 0.5) {
  //     image.sharpen();
  //   }

  //   // Crop the face region (you can adjust the coordinates as needed)
  //   const { x, y, width, height } = face.detection.box;
  //   const faceImageBuffer = await image.extract({ left: x, top: y, width, height }).toBuffer();

  //   // You can further process or save the cropped faceImageBuffer
  //   console.log(faceImageBuffer)
  // }
}


app.get('/do-compare', async (req, res) => {
  try {
    const uploadedImageBuffer = fs.readFileSync('./uploads/blur11.png');
    await processAndDetectFaces(uploadedImageBuffer);
    res.status(200).send('all good')
  }
  catch(err) {
    res.end('failed with ', err)
  }
})


const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Call the function with your uploaded image buffer
});