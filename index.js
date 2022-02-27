const http = require('http');

const {
  getFunc,
  postFunc,
  deleteOneFunc,
  deleteAllFunc,
  patchFunc,
  optionsFunc
} = require('./todoApiFunction');

const route = [
  {
    method: 'get',
    endpointRegex: /\/todos$/,
    action: getFunc
  },
  {
    method: 'post',
    endpointRegex: /\/todos$/,
    action: postFunc
  },
  {
    method: 'delete',
    endpointRegex: /\/todos$/,
    action: deleteAllFunc
  },
  {
    method: 'delete',
    endpointRegex: /\/todos\/*./,
    action: deleteOneFunc
  },
  {
    method: 'patch',
    endpointRegex: /\/todos\/*./,
    action: patchFunc
  },
  {
    method: 'options',
    endpointRegex: /\/todos*./,
    action: optionsFunc
  },
]

function reqListener(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const currentRoute = route.find(item => item.method === req.method.toLowerCase()
      && req.url.match(item.endpointRegex));

    currentRoute ? currentRoute.action(req, res, body) : errorHandle(res);
  });
}

const app = http.createServer(reqListener);
app.listen(process.env.PORT || 8080);