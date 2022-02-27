const successHandle = require('./successHandle');
const errorHandle = require('./errorHandle');
const { v4: uuidv4 } = require('uuid');

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
];

function getFunc(req, res, body) {
  successHandle(res, todos);
}

function postFunc(req, res, body) {
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
}

function deleteOneFunc(req, res, body) {
  const id = req.url.split('/').pop();
  const index = todos.findIndex(item => item.id === id);

  if (index === -1) {
    errorHandle(res, 'no this id');
    return;
  }

  todos.splice(index, 1);
  successHandle(res, todos);
}

function deleteAllFunc(req, res, body) {
  todos.length = 0;
  successHandle(res, todos);
}

function patchFunc(req, res, body) {
  const id = req.url.split('/').pop();
  const index = todos.findIndex(item => item.id === id);

  if (index === -1) {
    errorHandle(res, 'no this id');
    return;
  }

  try {
    const title = JSON.parse(body).title;
    if (!title) throw { message: 'no title property' };

    todos[index].title = title;
    successHandle(res, todos);
  } catch (error) {
    errorHandle(res, error.message);
  }
}

function optionsFunc(req, res, body) {
  successHandle(res);
}

module.exports = {
  getFunc,
  postFunc,
  deleteOneFunc,
  deleteAllFunc,
  patchFunc,
  optionsFunc
}

