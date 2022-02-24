const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');

const todos = [
  {
    id: uuidv4(),
    title: '寫測試'
  },
  {
    id: uuidv4(),
    title: '耍費'
  },
  {
    id: uuidv4(),
    title: '看片'
  },
]

const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
  } else if (req.method === 'OPTION') {
    res.writeHead(200, headers);
    res.end();
  } else if (req.method === 'DELETE' && req.url === '/todos') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    try {
      const id = req.url.split('/todos/').pop();
      const index = todos.findIndex(item => item.id === id);

      if (index === -1) {
        errorHandle(res, { message: 'no this id' });
        return;
      }

      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        status: 'success',
        message: todos
      }));
      res.end();
    } catch (error) {
      errorHandle(res, error);
    }
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const result = JSON.parse(body);

        if (result && result.title) {
          const id = req.url.split('/').pop();

          const index = todos.findIndex(item => item.id === id);

          if (index === -1) {
            errorHandle(res, { message: 'no this id' });
          } else {
            todos[index].title = result.title;
            res.writeHead(200, headers);
            res.write(JSON.stringify({
              status: 'success',
              data: todos
            }));
            res.end();
          }
        } else {
          errorHandle(res, { message: 'no title to update' });
        }

        console.log(result);
      } catch (error) {
        errorHandle(res, error);
      }
    })

  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const result = JSON.parse(body);

        if (result && result.title) {
          const newTodo = {
            title: result.title,
            id: uuidv4()
          };

          todos.push(newTodo);

          res.writeHead(200, headers);
          res.write(JSON.stringify({
            status: 'success',
            data: todos
          }));
        } else {
          errorHandle(res, { message: 'no title' })
        }
      } catch (error) {
        errorHandle(res, error);
      }
      res.end();  // 沒有end就會一直無法結束請求

    })
  } else {
    errorHandle(res, { message: 'not found' });
  }
}

const server = http.createServer(requestListener);

server.listen(8080);