// Toggle between MongoDB and local JSON database
// Use 'user.mongo' for MongoDB or 'user.local' for db.json

module.exports = require('./user.mongo'); // Default: MongoDB
// module.exports = require('./user.local'); // Uncomment this line to use db.json
