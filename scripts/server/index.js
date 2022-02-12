const express = require("express");
const app = express();
const port = 3000;
const { Route } = require("./models/route");
const { addLocals } = require("./helpers/middleware");

app.use(express.json({ limit: "50mb" }));
app.use(addLocals);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Forward requests to appropriate subrouter
["exercises", "heartrates"].forEach((name) => {
  const routeInstance = new Route(name);
  const controllerInstance = require(`./resources/${name}Controller`);
  const routes = routeInstance.attachRoutes(controllerInstance).Router;
  app.use(`/${name}`, routes);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
