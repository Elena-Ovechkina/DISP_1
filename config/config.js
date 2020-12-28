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
    db: 'mongodb+srv://disp1:disp1_example@cluster0.ehtz3.mongodb.net/disp1_test?retryWrites=true&w=majority'
    //  127.0.0.1
  }
};

module.exports = config[env];
