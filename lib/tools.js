'use strict';

const crypto = require('crypto');
const config = require('../config').qiniu;

function genUid(len) {
  len = len || 18;
  var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = [];
  for(var i = 0; i < len; i++) {
    result.push(str[Math.random() * str.length | 0])
  }
  return result.join('');
}



function getFlags() {
  //对这个方法只做简单上传到bucket就好
  var returnObj = {
    scope: config.BUCKET_NAME,
    deadline: 3600 + Math.floor(Date.now() / 1000)
  }
  return returnObj;
}

function urlsafeBase64Encode (jsonFlags) {
  var encoded = new Buffer(jsonFlags).toString('base64');
  return base64ToUrlSafe(encoded);
}

function base64ToUrlSafe (val) {
  return val.replace(/\//g, '_').replace(/\+/g, '-');
}

function hmacSha1 (encodedFlags, secretKey) {
  var hmac = crypto.createHmac('sha1', secretKey);
  return hmac.update(encodedFlags).digest('base64');
}

exports.getToken = function() {
  var flags = getFlags();
  var encodedFlags = urlsafeBase64Encode(JSON.stringify(flags));
  var encoded = hmacSha1(encodedFlags, config.SECRET_KEY);
  var encodedSign = base64ToUrlSafe(encoded);
  return config.ACCESS_KEY + ':' + encodedSign + ':' + encodedFlags;
}

exports.genUid = genUid;
