const header = require("./header");
function errorHandler(res, statusCode, message) {
  res.writeHead(statusCode, header);
  res.write(JSON.stringify({ status: "fail", message }));
  return res.end();
}

module.exports = errorHandler;
