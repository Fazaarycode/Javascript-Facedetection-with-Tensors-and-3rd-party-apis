const save = require("./utils/saveFile");
const path = require("path");

const tf = require("@tensorflow/tfjs-node");

const canvas = require("canvas");

const sharp = require("sharp"); // Import the sharp library


const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");
const modelPathRoot = "./models";

let optionsSSDMobileNet;

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


async function image(file) {
  try {
    const decoded = await tf.node.decodeImage(file); // Await the decoding process
    const casted = decoded.toFloat();
    decoded.dispose(); // Dispose of the original decoded tensor
    const result = casted.expandDims(0);
    casted.dispose(); // Dispose of the casted tensor
    return result;
  } catch (error) {
    console.error("Error during image processing:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// async function image(file) {
//   try {
//     const tensor = await tf.node.decodeImage(file); // Decode and cast in one step
//     return tensor;
//   } catch (error) {
//     console.error("Error during image processing:", error);
//     throw error; // Rethrow the error to be handled by the caller
//   }
// }


// async function detect(tensor) {
//   try {
//     const reshapedTensor = tensor.reshape([1, 400, 300, 3]); // Use 3 channels for RGB images
//     const result = await faceapi.detectAllFaces(reshapedTensor, optionsSSDMobileNet);
//     reshapedTensor.dispose(); // Dispose of the reshaped tensor
//     return result;
//   } catch (error) {
//     console.error("Error during face detection:", error);
//     throw error;
//   }
// }


async function detect(tensor) {
  try {
    const imageWidth = 300;
    const imageHeight = 300;
    const channels = 3;
    const tensorShape = [1, imageHeight, imageWidth, channels];
    const tensorSize = imageWidth * imageHeight * channels;
    const flatImageData = new Uint8Array(tensorSize); // Replace this with your image data

const mytensor = tf.tensor4d(flatImageData, tensorShape);

// Reshape the tensor to a desired shape, for example, [1, 90000, 1]
    const reshapedTensor = mytensor.reshape([1, tensorSize, 1]);

    const result = await faceapi.detectAllFaces(reshapedTensor, optionsSSDMobileNet);
    console.log('RE' , result)
    return result;
  } catch (error) {
    console.error("Error during face detection:", error);
    throw error;
  }
}



async function main(file, filename) {
  console.log('PROCESSING: ', filename)
  console.log("FaceAPI single-process test");

  await faceapi.tf.setBackend("tensorflow");
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set("DEBUG", false);
  await faceapi.tf.ready();

  console.log(
    `Version: TensorFlow/JS ${faceapi.tf.version_core} FaceAPI ${
      faceapi.version.faceapi
    } Backend: ${faceapi.tf.getBackend()}`
  );

  console.log("Loading FaceAPI models");
  
  const modelPath = path.join(__dirname, modelPathRoot);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
  });

  try {
    // Use sharp to resize the uploaded image
    console.log('file.data ' , file)
    
    const resizedImageBuffer = await sharp(file)
      .resize({ width: 300, height: 300 }) // Resize to desired dimensions
      .toBuffer();

    console.log('file.resizedImageBuffer ' , resizedImageBuffer, filename)
    const tensor = await image(resizedImageBuffer); // Pass the resized image to the image function
    const result = await detect(tensor);
    const extract = extractFeatures(tensor, result)
    console.log('over ' )
    // const areSimilar = compareFeatures(extract, extract, 0.3);

    return {}
    // return result


    // ... Rest of your processing ...
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }

}

// Function to compare facial features for similarity
function compareFeatures(features1, features2, similarityThreshold) {
  const distance = faceapi.euclideanDistance(features1, features2);
  return distance < similarityThreshold;
}


async function extractFeatures(tensor, detectionResult, width = 300, height = 300) {
  console.log(tensor.shape)
  const { _box, _score } = detectionResult[0];
  
  // const startY = Math.max(0, Math.floor(_box.y));
  // const startX = Math.max(0, Math.floor(_box.x));
  // const endY = Math.min(Math.ceil(_box.y + height), tensor.shape[1]); // Tensor height
  // const endX = Math.min(Math.ceil(_box.x + width), tensor.shape[2]); // Tensor width
  // const endChannels = Math.min(3, tensor.shape[3] ||); // Number of channels

const endChannels = 3;


const startY = 50; // Starting Y coordinate
const startX = 100; // Starting X coordinate
const tt = tf.randomNormal([1, 300, 300, 3]);

// Slice the tensor
const begin = [0, startY, startX];
const size = [1, 250, 200];

const tensorROI = tf.slice(tt, begin, size);


// const tensorROI = tensor.slice([0, startY, startX, 0], [1, endY - startY, endX - startX, endChannels]);
  // const endChannels =3
  
  // console.log('#X', endX)
  // console.log('#tensor.shape[1]', tensor.shape[1])
  // console.log('#_box.y + height', _box.y + height)
  // console.log(([0, startY, startX, 0], [1, Math.abs(endY - startY), endX - startX, endChannels]))
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');

  // Extract the region of interest (ROI) from the tensor based on the calculated bounding box indices
  // const tensorROI = tensor.slice([0, startY, startX], [1, endY - startY, endX - startX]);

  // const tensorROI = tensor.slice([0, startY, startX, 0], [1, Math.abs(endY - startY), startX - endX  , endChannels]);
  // const tensorROI = tensor.slice([0, startY, startX, 0], [1, endY - startY, endX - startX, endChannels]);

  try {
    // Resize the ROI tensor to the expected input dimensions of the model
    const resizedTensor = faceapi.tf.image.resizeBilinear(tensorROI, [height, width]);

    // Compute the face descriptor (facial features) using the resized tensor
    const faceDescriptor = await faceapi.computeFaceDescriptor(resizedTensor);

    // Dispose of the tensors
    tensor.dispose();
    tensorROI.dispose();
    resizedTensor.dispose();

    return faceDescriptor;
  } catch (error) {
    console.error("Error during feature extraction:", error);
    throw error;
  }
}



// async function extractFeatures(tensor, detectionResult, width = 300, height = 300) {
//   const { _box, _score } = detectionResult[0];

//   const startY = Math.max(0, Math.floor(_box.y));
//   const startX = Math.max(0, Math.floor(_box.x));
//   const endY = Math.min(Math.ceil(_box.y + height), tensor.shape[1]); // Tensor height
//   const endX = Math.min(Math.ceil(_box.x + width), tensor.shape[2]); // Tensor width
//   const endChannels = Math.min(3, tensor.shape[3]); // Number of channels

//   await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');

  
//   // Extract the region of interest (ROI) from the tensor based on the calculated bounding box indices
//   const tensorROI = tensor.slice([0, startY, startX, 0], [1, endY - startY, endX - startX, endChannels]);

//   // Resize the ROI tensor to the expected input dimensions of the model
//   const resizedTensor = faceapi.tf.image.resizeBilinear(tensorROI, [height, width]);

//   // // Compute the face descriptor (facial features) using the resized tensor
//   const faceDescriptor = await faceapi.computeFaceDescriptor(resizedTensor);

//   // // Dispose of the tensors
//   tensor.dispose();
//   tensorROI.dispose();
//   resizedTensor.dispose();

//   return faceDescriptor;
// }


module.exports = {
  detect: main,
};
