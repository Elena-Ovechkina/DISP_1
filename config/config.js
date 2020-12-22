const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'rrr',
      env: env
    },
    port: process.env.PORT || 3000,
    serverAddress: `http://localhost:${process.env.PORT || 3000}`,
    db: 'mongodb://localhost/rrr-development',
  },

  test: {
    root: rootPath,
    app: {
      name: 'rrr',
      env: env
    },
    port: process.env.PORT || 3000,
    serverAddress: `http://localhost:${process.env.PORT || 3000}`,
    db: 'mongodb://localhost/rrr-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'rrr',
      env: env
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/rrr-production'
  }
};

module.exports = config[env];
