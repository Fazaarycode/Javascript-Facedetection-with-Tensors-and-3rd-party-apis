const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const fs = require('fs')

app.use(fileUpload());

app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.get('/script.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

app.get('/vision.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'vision.js'));
});
app.get('/vision_bundle_cjs', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'vision_bundle.cjs'));
});

app.get('/face-api.min.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'face-api.min.js'));
});


app.use('/models', express.static(path.join(__dirname, 'models')));


app.use('/uploaded-images', express.static(path.join(__dirname, 'uploads')));


app.post('/upload', (req, res) => {
  if (!req.files || !req.files.uploadedFile) {
    return res.status(400).send('No file uploaded.');
  }
  // Should be done more elegantly
  const uploadedFile = req.files.uploadedFile;
  const { batch1, batch2 } = req.body
  const uploadPath = path.join(__dirname, 'uploads', `${batch1? 'batch1': 'batch2'}`, uploadedFile.name);
  if(batch1 === 'true' && batch2 ==='true') {
    const uploadPath1 = path.join(__dirname, 'uploads', 'batch1', uploadedFile.name);
    uploadedFile.mv(uploadPath1, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });
    const uploadPath2 = path.join(__dirname, 'uploads', 'batch2', uploadedFile.name);
    uploadedFile.mv(uploadPath2, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });
  }

  if(batch2 === 'true') {
    uploadedFile.mv(path.join(__dirname, 'uploads', 'batch2', uploadedFile.name), (err) => {
      if (err) {
        return res.status(500).send(err);
      }

    });
  }

  if(batch1 === 'true') {
    uploadedFile.mv(path.join(__dirname, 'uploads', 'batch1', uploadedFile.name), (err) => {
      if (err) {
        return res.status(500).send(err);
      }

    });
  }
  res.send('File uploaded!');
});

app.get('/get-uploaded-images', async (req, res) => {
  try {
    const uploadDirBatch1 = path.join(__dirname, 'uploads', 'batch1');
    const uploadDirBatch2 = path.join(__dirname, 'uploads', 'batch2');
    const files1 = await fs.readdirSync(uploadDirBatch1);
    const files2 = await fs.readdirSync(uploadDirBatch2);
    const imagePaths1 = files1.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    const imagePaths2 = files2.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    // res.json([...imagePaths2, { path: 'batch2'}, ...imagePaths1, {path: 'batch1'}]);
    res.json([
      {
        path: 'batch1',
        images: [...imagePaths1]
      },
      {
        path: 'batch2',
        images: [...imagePaths2]
      },
    ])
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching uploaded images' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
