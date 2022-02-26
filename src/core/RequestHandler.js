class RequestHandler {
  constructor(req) {
    this.body = '';
    this.temp = '';
    this.params = {};
    this.instance = req;
    this.instance.on('data', (chunk) => {
      this.temp += chunk;
    })
  }

  onEnd(callback) {
    this.instance.on('end', () => {
      this.body = this.temp ? JSON.parse(this.temp) : null;
      callback(this);
    });
  }
}

module.exports = RequestHandler;