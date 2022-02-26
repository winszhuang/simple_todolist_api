const RequestHandler = require('../core/RequestHandler');
const ResponseHandler = require('../core/ResponseHandler');

function createApp(req, res) {
  const reqHandler = new RequestHandler(req);
  const resHandler = new ResponseHandler(res);

  let isFinish = false;

  return {
    get: (endpoint, callback) => {
      if (isFinish) return;
      if (req.method !== 'GET') return;
      if (req.url !== endpoint) return;

      isFinish = true;
      callback(reqHandler, resHandler);
    },
    post: (endpoint, callback) => {
      if (isFinish) return;
      if (req.method !== 'POST') return;
      if (req.url !== endpoint) return;

      isFinish = true;
      reqHandler.onEnd((reqHandlerInstance) => {
        callback(reqHandlerInstance, resHandler);
      })
    },
    delete: (endpoint, callback) => {
      if (isFinish) return;
      if (req.method !== 'DELETE') return;

      if (endpoint === req.url) {
        isFinish = true;
        callback(reqHandler, resHandler);
        return;
      }

      if (endpoint.includes('/:')) {
        const baseEndPoint = endpoint.split('/:')[0];
        if (!req.url.startsWith(baseEndPoint)) return;

        const paramsKey = endpoint.split(':').pop();
        const paramsValue = req.url.split('/').pop();

        if (paramsValue) {
          reqHandler.params[paramsKey] = paramsValue;
        }

        isFinish = true;
        callback(reqHandler, resHandler);
      }
    },
    patch: (endpoint, callback) => {
      if (isFinish) return;
      if (req.method !== 'PATCH') return;

      const baseEndPoint = endpoint.split(':')[0];
      if (!req.url.startsWith(baseEndPoint)) return;

      const paramsKey = endpoint.split(':').pop();
      const paramsValue = req.url.split('/').pop();

      reqHandler.params[paramsKey] = paramsValue;

      isFinish = true;
      reqHandler.onEnd((reqHandlerInstance) => {
        callback(reqHandlerInstance, resHandler);
      });
    },
    options: (callback) => {
      if (isFinish) return;
      if (req.method !== 'OPTIONS') return;

      isFinish = true;
      callback(reqHandler, resHandler);
    },

    notFound: (callback) => {
      if (isFinish) return;
      callback(reqHandler, resHandler);
    }
  }
}

module.exports = createApp;