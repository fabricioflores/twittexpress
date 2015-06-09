'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/twittexpress-dev'
  },
  webSocketPort: 4444,
  seedDB: true
};
