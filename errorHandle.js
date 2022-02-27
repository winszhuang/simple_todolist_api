const headers = require('./headers');

function messageTransition(message) {
  if (message === 'Unexpected end of JSON input') {
    return 'body not json format'
  }

  if (message.startsWith('Unexpected token \n in JSON at position')) {
    return 'json input error'
  }

  return message;
}

function errorHandle(res, message = '404 not found') {
  res.writeHead(404, headers);
  res.write(JSON.stringify({
    status: 'false',
    message: messageTransition(message)
  }));
  res.end();
}

module.exports = errorHandle;