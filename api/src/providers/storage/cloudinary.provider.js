const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloud_name, api_key, api_secret, folder, format } = require('../../config/cloudinary');

let storage;
let configuredClient;

function getClient() {
    if (!configuredClient) {
        if (!cloud_name || !api_key || !api_secret) {
            throw new Error('Cloudinary environment variables are not configured');
        }
        cloudinary.config({
            cloud_name,
            api_key,
            api_secret,
        });
        configuredClient = cloudinary;
    }
    return configuredClient;
}

function getStorage() {
    if (!storage) {
        const client = getClient();
        storage = new CloudinaryStorage({
            cloudinary: client,
            params: {
                folder,
                format: async (req, file) => format,
                public_id: (req, file) => file.originalname,
            },
        });
    }
    return storage;
}

module.exports = {
    get storage() {
        return getStorage();
    },
    get client() {
        return getClient();
    }
};
