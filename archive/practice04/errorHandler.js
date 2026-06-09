const header = require("./header");

function errorHandler(res, statusCode, message) {
  res.writeHead(statusCode, header);
  res.write(JSON.stringify({ status: "fail", message }));
  res.end();
}
module.exports = errorHandler;
