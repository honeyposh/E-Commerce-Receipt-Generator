const cloudinary = require("../config/cloudinary");
async function uploadToCloud(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "Receipt",
    resource_type: "raw",
    type: "authenticated",
  });
  return {
    publicId: result.public_id,
    url: result.secure_url,
  };
}

function generateSignedReceiptUrl(publicId) {
  return cloudinary.utils.private_download_url(publicId, "pdf", {
    resource_type: "raw",
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + 10 * 60,
  });
}
module.exports = { generateSignedReceiptUrl, uploadToCloud };
