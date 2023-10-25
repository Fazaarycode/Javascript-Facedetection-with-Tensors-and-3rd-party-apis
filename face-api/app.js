const express = require("express");
const fileUpload = require("express-fileupload");
const faceApiService = require("./faceApiService");

const app = express();
const port = 3009;

app.use(fileUpload()); // Add the fileUpload middleware

app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  console.log(
    '******'
  )
  // for(const file of req.files) {
    console.log('My file is  === \n ', )
    let allPics = Object.keys(req.files)
    allPics.map(pic =>console.log(req.files[pic].data) )
  // }
  let allDetection = []
  allPics.map(async pic => {
    allDetection = await faceApiService.detect(req.files[pic].data, req.files[pic].name)
    return allDetection
  } )
  console.log('My Dets are  === \n ', allDetection)
  // await faceApiService.detect(req.files.image.data, req.files.image.name)
  // console.log('Result', result)
  // res.json({
  //   detectedFaces: result.length,
  //   url: `http://localhost:3000/out/${file.name}`,
  // });
  res.send('bye')
});



app.use("/out", express.static("out"));

app.listen(port, () => {
  console.log("Server started on port" + port);
});
