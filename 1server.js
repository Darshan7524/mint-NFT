const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');



const app = express();
const port = process.env.PORT || 3002;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files, like your HTML form
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Define a route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit-form', upload.single('imageUpload'), (req, res) => {
  const { nftName, nftDescription, priceEth } = req.body;
  const imageFileName = req.file ? req.file.filename : 'No image uploaded';

  console.log('NFT Name:', nftName);
  console.log('NFT Description:', nftDescription);
  console.log('Price (in ETH):', priceEth);
  console.log('Image File Name:', imageFileName);

  res.send('Form submitted successfully.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
