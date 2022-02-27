const http = require('http');
const { v4: uuidv4 } = require('uuid');
const successHandle = require('./successHandle');
const errorHandle = require('./errorHandle');

const BASE_URL = '/todos';
const ADD_PARAMS_URL_REGEX = new RegExp(`${BASE_URL}/*.`);

const todos = [
  {
    title: '玩遊戲',
    id: uuidv4()
  },
  {
    title: '寫程式',
    id: uuidv4()
  },
  {
    title: '上課',
    id: uuidv4()
  },
]

function reqListener(req, res) {
  const url = req.url;
  const method = req.method;

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  if (method === 'GET' && url === BASE_URL) {
    successHandle(res, todos);
    return;
  }

  if (method === 'POST' && url === BASE_URL) {
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
    });
    return;
  }

  if (method === 'DELETE' && url === BASE_URL) {
    todos.length = 0;
    successHandle(res, todos);
    return;
  }

  if (method === 'DELETE' && url.match(ADD_PARAMS_URL_REGEX)) {
    const id = url.split('/').pop();
    const index = todos.findIndex(item => item.id === id);

    if (index === -1) {
      errorHandle(res, 'cant find this id');
      return;
    }

    todos.splice(index, 1);
    successHandle(res, todos);
    return;
  }

  if (method === 'PATCH' && url.match(ADD_PARAMS_URL_REGEX)) {
    const id = url.split('/').pop();
    const index = todos.findIndex(item => item.id === id);

    if (index === -1) {
      errorHandle(res, 'cant find this id');
      return;
    }

    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (!title) throw { message: 'no title property' };

        todos[index].title = title;
        successHandle(res, todos);
      } catch (error) {
        errorHandle(res, error.message);
      }
    })
    return;
  }

  if (method === 'OPTIONS') {
    successHandle(res);
    return;
  }

  errorHandle(res);
}

const app = http.createServer(reqListener);
app.listen(process.env.PORT || 8080);