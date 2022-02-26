const http = require('http');
const createApp = require('./src/core/api');
const { v4: uuidv4 } = require('uuid');

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
  }
]

const requestListener = (req, res) => {
  const app = createApp(req, res);

  app.get('/todos', (req, res) => {
    res.send({
      status: 'success',
      data: todos
    })
  });

  app.post('/todos', (req, res) => {
    try {
      const title = req.body.title;
      if (!title) {
        res.status(404).send({
          status: 'false',
          message: 'no title property'
        });
        return;
      }

      const newTodo = {
        title,
        id: uuidv4()
      };
      todos.push(newTodo);
      res.send(todos);
    } catch (error) {
      res.status(404).send({
        status: 'false',
        message: error.message
      });
    }
  });

  app.patch('/todos/:id', (req, res) => {
    try {
      const id = req.params.id;
      const index = todos.findIndex(item => item.id === id);
      if (index === -1) {
        res.status(404).send({
          status: 'false',
          message: 'no existed id'
        });
        return;
      }

      const body = req.body;
      if (!body) {
        res.status(404).send({
          status: 'false',
          message: 'should given body'
        });
        return;
      }

      const title = body.title;
      if (!title) {
        res.status(404).send({
          status: 'false',
          message: 'no title property'
        });
        return;
      }

      todos[index].title = title;
      res.send({
        status: 'success',
        data: todos
      });
    } catch (error) {
      res.status(404).send({
        status: 'false',
        message: error.message
      });
    }
  })

  app.delete('/todos', (req, res) => {
    todos.length = 0;
    res.send({
      status: 'success',
      data: todos
    });
  });

  app.delete('/todos/:id', (req, res) => {
    try {
      const id = req.params.id;
      const index = todos.findIndex(item => item.id === id);
      if (index === -1) {
        res.status(404).send({
          status: 'false',
          message: 'no existed id'
        });
        return;
      }

      todos.splice(index, 1);
      res.send({
        status: 'success',
        data: todos
      });
    } catch (error) {
      res.status(404).send({
        status: 'false',
        message: error.message
      });
    }
  });

  app.options((req, res) => {
    res.send();
  });

  app.notFound((req, res) => {
    console.log('進來not found了...')
    res.status(404).send({
      status: 'false',
      message: 'not found'
    });
  });
}

const server = http.createServer(requestListener);

server.listen(process.env.PORT || 8080);