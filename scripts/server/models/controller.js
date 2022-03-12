"use-strict";
const SUCCESSFUL_UPDATE = 203;
const SUCCESSFUL_GET = 200;
const SUCCESSFUL_CREATE = 201;
const { client } = require("../services/elasticsearch");
const { getIdName, getWhereToStoreResult, exec } = require("../helpers/index");
const bodybuilder = require("bodybuilder");

async function addToRes(result, req, res) {
  res.locals[getWhereToStoreResult()] = { total: result.length, data: result };
}

class Controller {
  constructor(index) {
    this.index = index;
    this.idName = getIdName(index);
  }

  async _all(req, res, next) {
    const params = {
      index: this.index,
      body: this.getSupportedQueryParams(req, bodybuilder()),
    };
    const p = await exec(client, "search", params, ...arguments);
    addToRes(p.body.hits.hits, ...arguments);
    res.status(SUCCESSFUL_GET);
    return next();
  }

  async _byID(req, res, next) {
    const params = {
      id: req.params[this.idName],
      index: this.index,
      body: this.getSupportedQueryParams(req, bodybuilder()),
    };
    const p = await exec(client, "get", params, ...arguments);
    addToRes([p.body], ...arguments);
    res.status(SUCCESSFUL_GET);
    return next();
  }

  async _create(req, res, next) {
    const params = {
      index: this.index,
      body: { ...req.body, ...this.addFields(req.body) },
    };
    const p = await exec(client, "index", params, ...arguments);
    addToRes(p, ...arguments);
    res.status(SUCCESSFUL_CREATE);
    return next();
  }

  async _bulkCreate(req, res, next) {
    const body = req.body.flatMap((d) => [
      { index: { _index: this.index } },
      Object.assign(d, this.addFields(d)),
    ]);

    const params = { index: this.index, refresh: true, body };
    const p = await exec(client, "bulk", params, ...arguments);
    addToRes(p, ...arguments);
    res.status(SUCCESSFUL_CREATE);
    return next();
  }

  async _update(req, res, next) {
    const params = {
      id: req.params[this.idName],
      index: this.index,
      body: { doc: req.body },
    };
    const p = await exec(client, "update", params, ...arguments);
    addToRes(p, ...arguments);
    res.status(SUCCESSFUL_UPDATE);
    return next();
  }
}

module.exports = { Controller };
