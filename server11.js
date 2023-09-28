const express = require("express");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");

const path = require('path');

const app = express();

// app.set("view engine", "ejs")

// app.get("/", (req,res)=> {
//     res.render("index")
// })
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));

// root path / to serve "index.html" as the default 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public')); //to use public folder

app.post('/submit-form', (req, res) => {
  const { nftName, nftDescription, priceEth } = req.body;
  console.log("NFT server name is " + nftName);
  console.log("nft Description " + nftDescription);
  console.log("priceEth is " + priceEth);
 // make ipfs api req before this line , i guess
  
});

const upload = multer(); // we need multer for enctype multipart

// app.post('/submit-form', upload.none(), (req, res) => {
//   const formData = req.body;
//   console.log('form data', formData);
//   res.sendStatus(200);
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
