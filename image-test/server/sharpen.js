// const sharp = require('sharp');

// // Input and output file paths
// const inputImagePath = './uploads/blur11.png';
// const outputImagePath = './uploads/blur11final.png';

// // Sharpen the image
// sharp(inputImagePath)
//   .sharpen()
//   .toFile(outputImagePath, (err, info) => {
//     if (err) {
//       console.error('Error sharpening image:', err);
//     } else {
//       console.log('Image sharpened:', info);
//     }
//   });

const express = require('express');
const multer = require('multer');
const path = require('path');

const faceapiService = require('./detectFaces')


const app = express();

// Set up storage for uploaded images using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext); // Set a unique filename for each uploaded image
  }
});

const upload = multer({ storage: storage });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  
  if (!req.file) {
    console.log(req.file)
    return res.status(400).send('No image uploaded.');
  }

  console.log('***', req.file)

  // Uploaded image has been stored in the "uploads" directory
  const abc = faceapiService.detect(req.file)

  console.log(abc)

  res.status(200).send('Image uploaded successfully.');
});

app.get('/', (req,res) => {
  res.status(200).send('Hey I am Server')
})

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
