const headers = require('../const/headers');

class ResponseHandler {
  constructor(res) {
    this.res = res;
    this.currentStatusCode = 200
    this.headers = headers;
  }

  status(statusCode) {
    this.res.statusCode = statusCode;
    this.currentStatusCode = statusCode;
    return this;
  }

  send(data) {
    const writeData = data ? JSON.stringify(data) : '';

    this.res.writeHead(this.currentStatusCode, headers);
    this.res.write(writeData);
    this.res.end();
  }
}

module.exports = ResponseHandler;