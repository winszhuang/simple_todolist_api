const http = require('http');
const { v4: uuidv4 } = require('uuid');
const successHandle = require('./successHandle');
const errorHandle = require('./errorHandle');

const BASE_URL = '/todos';
const HAS_PARAMS_URL_REGEX = new RegExp(`${BASE_URL}/*.`);

const todos = [
  {
    title: '寫測試',
    id: uuidv4()
  },
  {
    title: '做事情',
    id: uuidv4()
  },
  {
    title: '發呆',
    id: uuidv4()
  },
]

function reqListener(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.method === 'GET' && req.url === BASE_URL) {
    successHandle(res, todos);
    return;
  }

  if (req.method === 'POST' && req.url === BASE_URL) {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (!title) throw { message: 'no title property' };

        todos.push({
          title,
          id: uuidv4()
        });
        successHandle(res, todos);
      } catch (error) {
        console.log('測試error: ' + error.message);
        errorHandle(res, error.message);
      }
    })
    return;
  }

  if (req.method === 'DELETE' && req.url.match(HAS_PARAMS_URL_REGEX)) {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(item => item.id === id);

    if (index === -1) {
      errorHandle(res, 'no this id');
      return;
    }

    todos.splice(index, 1);
    successHandle(res, todos);
    return;
  }

  if (req.method === 'DELETE' && req.url === BASE_URL) {
    todos.length = 0;
    successHandle(res, todos);
    return;
  }

  if (req.method === 'PATCH' && req.url.match(HAS_PARAMS_URL_REGEX)) {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(item => item.id === id);

    if (index === -1) {
      errorHandle(res, 'no this id');
      return;
    }

    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (!title) throw { message: 'no title property' };

        todos[index].title = title;
        successHandle(res, todos);
      } catch (error) {
        console.log('測試error: ' + error.message);
        errorHandle(res, error.message);
      }
    })
    return;
  }

  if (req.method === 'OPTIONS') {
    successHandle(res);
    return;
  }

  errorHandle(res);
}

const app = http.createServer(reqListener);
app.listen(process.env.PORT || 8080);