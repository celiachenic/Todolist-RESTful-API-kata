const header = require("./header");

function successHandle(res, statusCode, data) {
  res.writeHead(statusCode, header);
  res.write(JSON.stringify({ status: "success", data }));
  return res.end();
}

module.exports = successHandle;
