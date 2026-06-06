const header = require("./header");

function successHandler(res, statusCode, data) {
  res.writeHead(statusCode, header);
  res.write(JSON.stringify({ status: "success", data }));
  return res.end();
}

module.exports = successHandler;
