const multer = require('multer');

const storageProvider = require('../providers/storage');

const upload = multer({ storage: storageProvider.storage });

module.exports = upload;
