const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloud_name, api_key, api_secret, folder, format } = require('../../config/cloudinary');

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder,
    format: async (req, file) => format,
    public_id: (req, file) => file.originalname,
  },
});

module.exports = {
    storage,
    client: cloudinary
};
