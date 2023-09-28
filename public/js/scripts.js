
const form = document.getElementById("myForm");
        
form.addEventListener("submit", function (event) {
  // Prevent the default form submission behavior (page reload)
  event.preventDefault();

  
  const formData = new FormData(form);
  const nftName = formData.get("nftName");
  const nftDescription = formData.get("nftDescription");
  const priceEth = formData.get("priceEth");
  const imageUpload = formData.get("imageUpload"); // Get the uploaded image file


  console.log("NFT Name:", nftName);
  console.log("NFT Description:", nftDescription);
  console.log("Price (in ETH):", priceEth);
  console.log("Image File:", imageUpload); // Log the image file object

 //this is client side script, should i sent to backend to use ipfs api or ?
  
  fetch("/submit-form", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("Response from server:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  
});