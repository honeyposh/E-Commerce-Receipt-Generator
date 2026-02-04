const cloudinary = require("../config/cloudinary");
async function uploadToCloud(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "Receipt",
    resource_type: "image",
    type: "authenticated",
  });
  return {
    publicId: result.public_id,
    url: result.secure_url,
  };
}
module.exports = uploadToCloud;
