const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;
  const repos = { id: uuid(), title: title, url: url, techs: techs, likes: likes };
  repositories.push(repos);
  return response.json(repos);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0) {
    return response.status(404).json({ error: "Repository not found!" });
  }

  const repoUpdate = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  };

  repositories[repoIndex] = repoUpdate;

  return response.json(repoUpdate);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(404).json({ error: "Repository not found!" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0) {
    return response.status(404).json({ error: "Repository not found!" });
  }

  repositories[repoIndex].likes++;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
