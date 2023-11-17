const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { Console } = require('console');
const external_url = "https://ivory-gorgeous-ladybug-294.mypinata.cloud/"
require('dotenv').config(); 
const JWT = process.env.Pinata_JWT;

const mintNFTFunctions = require('./scripts/mint-nft'); // Adjust the path as needed
const mintNFT = mintNFTFunctions.mintNFT;


const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("./artifacts/contracts/MyNFT.sol/MyNFT.json");
const { type } = require('os');
const contractAddress = "0x2b4560DeF5c3dF9DC807025e5cF0FFbf37b954A6"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

const app = express();
const port = process.env.PORT || 3003;

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

// Handle form submission and IPFS pinning
app.post('/submit-form', upload.single('imageUpload'), async (req, res) => {
  const { nftName, nftDescription, priceEth } = req.body;
  const imageFileName = req.file ? req.file.filename : 'No image uploaded';

  console.log('NFT Name:', nftName);
  console.log('NFT Description:', nftDescription);
  console.log('Price (in ETH):', priceEth);
  console.log('Image File Name:', imageFileName);

  // IPFS pinning logic


const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = 'uploads/'+imageFileName;
    
    const file = fs.createReadStream(src)
    formData.append('file', file)
    
    const pinataMetadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${JWT}`
        }
      });
      console.log(res.data);
      return res.data.IpfsHash;
    } catch (error) {
      console.log(error);
    }
}

const uploadMetadata = async () => {
  try {
    const data = JSON.stringify({
      pinataContent: {
        name: nftName,
        description: `${nftDescription}`,
        external_url: `${external_url}`,
        image: `ipfs://${IpfsHash}`,
      },
      pinataMetadata: {
        name: "Pinnie NFT Metadata",
      },
    });

    const resJ = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.Pinata_JWT}`
      },
      body: data
    })
    const resJData = await resJ.json()
    console.log("Metadata uploaded, CID:", resJData.IpfsHash)
    return resJData.IpfsHash
  } catch (error) {
    console.log(error)
  }
}


const IpfsHash = await pinFileToIPFS();
// respData = await resp.json();
// const IpfsHash = respData.IpfsHash;
const IpfsHashJson = await uploadMetadata();
  const hash = await mintNFT("ipfs://" + IpfsHashJson)
  var hashString = String(hash);

res.send(`NFT minted at address: ${hash}`);
  console.log("console minted at" + hash);
  console.log("type of hash is " + typeof(hash) + "type of hashString is" + typeof(hashString))

const options = {
  method: 'POST',
  headers: {accept: 'application/json', 'content-type': 'application/json'},
  body: JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    params: [hash],
    method: 'eth_getTransactionReceipt'
  })
};

fetch('https://eth-sepolia.g.alchemy.com/v2/sLvAuK_Bko_iGiJMHW8VIrWCwbGJPEar', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
  // console.log("check point after axios")
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
