const express = require('express');
const path = require('path');

const cors = require('cors'); // Import the cors package

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

// Serve static files from the "models" directory
app.use('/models', express.static(path.join(__dirname, 'models')));

app.get('/hi', (req,res) => res.send('hii '))
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
