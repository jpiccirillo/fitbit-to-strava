"use-strict";
const express = require("express");
const { getIdName } = require("../helpers/");
const { final } = require("../helpers/middleware");

class Route {
  constructor(index) {
    this.index = index;
    this.Router = express.Router();
  }

  attachRoutes(controller) {
    // Somehow we're losing context for the controller methods (need to reattach their 'this').  Also add the final middleware
    const b = (cb) => [cb.bind(controller), final];
    this.Router.get("/", ...b(controller._all));
    this.Router.get("/:" + getIdName(this.index), ...b(controller._byID));
    this.Router.post("/", ...b(controller._create));
    this.Router.post("/bulk", ...b(controller._bulkCreate));
    this.Router.patch("/:" + getIdName(this.index), ...b(controller._update));
    return this;
  }
}

module.exports = { Route };
