const { Client } = require("@elastic/elasticsearch");
const port = 9400;
const host = "localhost";
const protocol = "http";
const client = new Client({ node: `${protocol}://${host}:${port}` });

module.exports = { client };
