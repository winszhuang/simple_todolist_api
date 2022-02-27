const headers = require('./headers');

const errorMessageList = {
  'Unexpected token u in JSON at position 0': 'wrong json format',
  'Unexpected end of JSON input': 'wrong json format'
};

function errorHandle(res, message = '404 not found') {
  const correctMessage = errorMessageList[message] || message;

  res.writeHead(404, headers);
  res.write(JSON.stringify({
    status: 'false',
    message: correctMessage
  }));
  res.end();
}

module.exports = errorHandle;