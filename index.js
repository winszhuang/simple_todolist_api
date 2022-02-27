const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');
const successHandle = require('./successHandle');

const BASE_URL = '/todos';
const NEED_PARAMS_URL_REGEX = new RegExp(`${BASE_URL}/.*$`);

const todos = [
  {
    title: '做事',
    id: uuidv4()
  },
  {
    title: '玩遊戲',
    id: uuidv4()
  },
  {
    title: '做運動',
    id: uuidv4()
  },
]

function reqListener(req, res) {
  const methodName = req.method;
  const url = req.url;

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  if (methodName === 'GET' && url === BASE_URL) {
    successHandle(res, todos);
    return;
  }

  if (methodName === 'POST' && url === BASE_URL) {
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
        errorHandle(res, error.message);
      }
    });
    return;
  }

  if (methodName === 'PATCH' && url.match(NEED_PARAMS_URL_REGEX)) {
    try {
      const id = req.url.split('/').pop();
      if (!id) throw { message: 'no id, please input id' };

      const index = todos.findIndex(item => item.id === id);
      if (index === -1) throw { message: 'no existing id' };

      req.on('end', () => {
        const title = JSON.parse(body).title;
        if (!title) throw { message: 'no title property' };

        todos[index].title = title;
        successHandle(res, todos);
      });
    } catch (error) {
      console.log('測試看error message: + ' + error.message);
      errorHandle(res, error.message);
    }
    return;
  }

  if (methodName === 'DELETE' && url === BASE_URL) {
    todos.length = 0;
    successHandle(res, todos);
    return;
  }

  if (methodName === 'DELETE' && url.match(NEED_PARAMS_URL_REGEX)) {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(item => item.id === id);

    if (index === -1) {
      errorHandle(res, 'no existing id');
      return;
    }

    todos.splice(index, 1);
    successHandle(res, todos);
    return;
  }

  if (methodName === 'OPTIONS') {
    successHandle(res, '');
    return;
  }

  errorHandle(res);
}

const app = http.createServer(reqListener);
app.listen(process.env.PORT || 8080);