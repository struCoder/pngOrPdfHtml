'use strict';

const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const config = require('./config');

app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(config.port, function() {
  console.log('server was running at ', config.port)
})
