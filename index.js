'use strict';

const http = require('http');
const express = require('express');
const app = express();
const handlebars = require('handlebars')
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config');
const fs = require('fs');
const tools = require('./lib/tools');
const wkhtml = require('./lib/wkhtml');
const validType = ['pdf', 'png'];
const typeMap = {
  'pdf': 'wkhtmltopdf',
  'png': 'wkhtmltoimage'
};

const baseImgsPath = path.join(__dirname, '/images/');
let tpl = fs.readFileSync(path.join(__dirname,'/tpl/exportTpl.html'), {encoding: 'utf8'});
let tplCompiled = handlebars.compile(tpl);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function route(app) {
  app.post('/gen', function(req, res) {
    const body = req.body;
    const htmlVal = body.data;
    const type = body.type;
    const command = typeMap[type];
    if (!command) {
      res.statusCode = 400;
      res.end('only suppprt png or pdf type');
      return;
    }
    const retHtml = tplCompiled({
      html: htmlVal
    });
    let options;
    let filePath;
    let filename;
    if (type === 'png') {
      options = {quality: 100};
      filename = tools.genUid() + '.png'
      filePath = path.join(baseImgsPath, filename);
    } else {
      options =  {pageSize: 'A4'};
      filename = tools.genUid() + '.pdf'
      filePath = path.join(baseImgsPath, filename);
    }
    let streamTmp = fs.createWriteStream(filePath);
    let pipeStream = wkhtml(command, retHtml,options).pipe(streamTmp);
    pipeStream.on('finish', function() {
       var retData = {
        code: 0,
        type: type,
        filename: filename
      };
      res.send(retData);
    });
  });

  app.get('/download', function(req, res) {
    const query = req.query;
    const filename = query.filename;
    const type = query.type;
    if (validType.indexOf(type) === -1) {
      res.statusCode = 400;
      res.end('type Wrong');
      return;
    }
    const filePath = path.join(baseImgsPath, filename);
    if(!fs.existsSync(filePath)) {
      res.statusCode = 403;
      res.end('forbidden')
      return;
    }
    const fileSize = fs.statSync(filePath).size;
    let readStream = fs.createReadStream(filePath);
    res.setHeader('Content-type', 'image/' + type);
    res.setHeader('Content-length', fileSize);
    res.setHeader('Content-disposition','attachment; filename="' + filename + '"');
    readStream.pipe(res);
  })
}

route(app)

http.createServer(app).listen(config.port, function() {
  console.log('server was running at ', config.port)
});
