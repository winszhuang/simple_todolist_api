const headers = require('./headers');

const commonTranslationMessage = {
  "Unexpected end of JSON input": "error json format",
  "Converting circular structure to JSON\n    --> starting at object with constructor 'Array'\n    |     index 3 -> object with constructor 'Object'\n    --- property 'data' closes the circle": "Converting circular structure to JSON"
}

function errorHandle(res, message = '404 not found') {
  res.writeHead(404, headers);
  res.write(JSON.stringify({
    status: 'false',
    message: commonTranslationMessage[message] || message
  }));
  res.end();
}

module.exports = errorHandle;