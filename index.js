const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  {
    id: "0",
    title: "Projeto 0",
    tasks: ['Tarefa 1', 'Tarefa 2']
  },
  {
    id: "1",
    title: "Projeto 1",
    tasks: ['Tarefa 1']
  },
  {
    id: "2",
    title: "Projeto 2",
    tasks: ['Tarefa 1', 'Tarefa 2', 'Tarefa 3']
  },
]

let count = 1;

//Middleware LOCAL
function logRequestCount(req, res, next){
  console.log(`Foram feitas ${count} requisições`)

  return next();
}

//Middleware LOCAL
function checkUserInArray(req, res, next){
  const project = projects[req.params.id];

  if(!project){
    return res.status(400).json({ error: "Project does not exist" });
  }

  req.project = project;

  return next();
}

//Rota que lista todos projetos e suas tarefas
server.get('/projects', logRequestCount, (req, res) => {
  count++
  return res.json(projects);
})

//Rota que cadastra um novo projeto
server.post('/projects', logRequestCount, (req, res) => {
  count++

  const {id, title} = req.body;
  const newProject = {id, title, tasks: []};

  projects.push(newProject);

  return res.json(projects);
})

//Rota que cadastra uma nova tarefa em um determinado projeto
server.post('/projects/:id/tasks', checkUserInArray, logRequestCount, (req, res) => {
  count++

  const {id} = req.params;
  const {title} = req.body;

  const newTask = title;

  projects[id].tasks.push(newTask);

  return res.json(projects)
})

//Rota que altera o título do projeto
server.put('/projects/:id', checkUserInArray, logRequestCount,(req, res) => {
  count++

  const {id} = req.params;
  const {title} = req.body;

  projects[id].title = title

  return res.json(projects)
})

//Rota que deleta o projeto
server.delete('/projects/:id', checkUserInArray, logRequestCount,(req, res) => {
  count++

  const {id} = req.params;

  projects.splice(id, 1);

  return res.json(projects);
})


server.listen(3000);