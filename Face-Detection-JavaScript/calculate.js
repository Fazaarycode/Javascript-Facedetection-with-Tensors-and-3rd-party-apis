// import faz1 from './faz1.json';
// import nas1 from './nas1.json';

const nas1 = require('./nas1.json')
const nas2 = require('./nas2.json')
const faz1 = require('./faz1.json')
const faz4 = require('./faz4.json')
// Assuming you have two sets of facial data: temp5_1 and temp5_2

function euclideanDistance(pt1, pt2) {
  const dx = pt1._x - pt2._x;
  const dy = pt1._y - pt2._y;
  return Math.sqrt(dx * dx + dy * dy);
}


function calculateAverageEuclideanDistance(landmarks1, landmarks2) {
  if (landmarks1.length !== landmarks2.length) {
    throw new Error("Landmarks arrays must have the same length");
  }

  let sum = 0;
  for (let i = 0; i < landmarks1.length; i++) {
    const dist = euclideanDistance(landmarks1[i], landmarks2[i]);
    sum += dist;
  }
  return sum / 100;
}

function areFacesSimilar(temp5_1, temp5_2, landmarkThreshold = 0.5, expressionThreshold = 0.5) {
  const averageDistance = calculateAverageEuclideanDistance(
    temp5_1[0].landmarks._positions,
    temp5_2[0].landmarks._positions
  );

  let distAvg = averageDistance/ temp5_1[0].landmarks._positions.length
  console.log(distAvg)
  if (distAvg >= 0.75) {
    console.log("ED:: Faces are similar");
  } else {
    console.log("ED:: Faces are not similar");
  }
}

const firstImage = nas1 
const secondImage = faz4 
const similar = areFacesSimilar(firstImage, secondImage);
