// import '@tensorflow/tfjs-node';
 
// // implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
// import * as canvas from 'canvas';
 
// import * as faceapi from 'face-api.js';
 
// import fs from 'fs'

// import { createCanvas, loadImage } from 'canvas'

// // patch nodejs environment, we need to provide an implementation of
// // HTMLCanvasElement and HTMLImageElement
// const canvas = createCanvas(500,500)
// faceapi.env.monkeyPatch({ Canvas: createCanvas, Image, ImageData })

// await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models')
// console.log('wt')
// // const net = new faceapi.SsdMobilenetv1()
// // await net.loadFromUri('./mymodels')


// let imageSingleLoc = './uploads/blur11.png'
// // let imageGroupLoc = './uploads/group1a.png'

// // const imageGroupLoc = '<img id="myImg" src="./uploads/group1a.png" />';

// const imageBuffer = await fs.readFileSync('./uploads/group1a.png');
// const imageGroupLoc = await loadImage(imageBuffer);



// // const detectionsGroup = await faceapi.detectAllFaces(imageGroupLoc)

// // const detectionGroup = await faceapi.detectSingleFace(imageGroupLoc)

// // const detectionsSingle = await faceapi.detectAllFaces(imageSingleLoc)

// // const detectionSingle = await faceapi.detectSingleFace(imageSingleLoc)


// // const detectionsGroupWithLandmarks = await faceapi.detectAllFaces(imageGroupLoc).withFaceLandmarks()

// // const detectionGroupWithLandmarks = await faceapi.detectSingleFace(imageGroupLoc).withFaceLandmarks()


// // const resultsGroup = await faceapi.detectAllFaces(imageGroupLoc).withFaceLandmarks().withFaceDescriptors()

// // const resultsWithExpressionsAgeGroup = await faceapi.detectAllFaces(imageGroupLoc).withFaceLandmarks().withFaceDescriptors().withAgeAndGender()
// const resultsWithExpressionsAgeGroup = await faceapi.detectAllFaces(imageGroupLoc).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors()

// // const resultBestSingleFace = await faceapi.detectSingleFace(imageGroupLoc).withFaceLandmarks().withFaceDescriptors().withAgeAndGender()


// // if (!resultsWithExpressionsAgeGroup.length) {
// //   console.log('Nothing found on group')
// //   // return
// // }

// if (!resultsWithExpressionsAgeGroup.length) {
//   console.log('Nothing best group face on group')
//   // return
// }


// if (resultsWithExpressionsAgeGroup) {
//   const bestMatch = faceMatcher.findBestMatch(resultsWithExpressionsAgeGroup.descriptor)
//   console.log(bestMatch.toString())
// }


// // Display on canvas

// // const displaySize = { width: input.width, height: input.height }
// // resize the overlay canvas to the input dimensions
// // const canvas = document.getElementById('overlay')
// // faceapi.matchDimensions(canvas, displaySize)

const path = require("path");

const tf = require("@tensorflow/tfjs-node");

const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");
const modelPathRoot = "./models";

let optionsSSDMobileNet;

async function image(file) {
  console.log('inside image func', file)
  const decoded = tf.node.decodeImage(file);
  console.log('Res 1 ', decoded)
  const casted = decoded.toFloat();
  const result = casted.expandDims(0);
  decoded.dispose();
  casted.dispose();
  return result;
}

async function detect(tensor) {
  const result = await faceapi.detectAllFaces(tensor, optionsSSDMobileNet);
  return result;
}

async function main(file) {
  console.log("FaceAPI single-process test");

  await faceapi.tf.setBackend("tensorflow");
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set("DEBUG", false);
  await faceapi.tf.ready();

  console.log(
    `Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${
      faceapi.version.faceapi
    } Backend: ${faceapi.tf?.getBackend()}`
  );

  console.log("Loading FaceAPI models");
  const modelPath = path.join(__dirname, modelPathRoot);
  console.log(`Model path is `, modelPath)
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
  });

  const tensor = await image(file);
  const result = await detect(tensor);
  console.log("Detected faces:", result.length);

  tensor.dispose();

  return result;
}

module.exports = {
  detect: main,
};