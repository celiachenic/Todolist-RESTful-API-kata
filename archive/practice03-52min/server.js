const http = require("http");
const header = require("./header");
const successHandler = require("./successHandler");
const errorHandler = require("./errorHandler");
const { v4: uuidv4 } = require("uuid");
const todos = [{ title: "買牛奶", id: uuidv4() }];
function requestListener(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  if (req.method === "OPTIONS") {
    res.writeHead(200, header);
    return res.end();
  } else if (req.url === "/todos" && req.method === "GET") {
    return successHandler(res, 200, todos);
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    return successHandler(res, 200, todos);
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return errorHandler(res, 400, "JSON解析失敗");
      }
      const { title } = data;
      if (!title || title.toString().trim() === "") {
        return errorHandler(res, 400, "資料格式錯誤 或 輸入為空白");
      }
      todos.push({
        title: title.toString().trim(),
        id: uuidv4(),
      });
      return successHandler(res, 201, todos);
    });
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const urlELements = req.url.split("/");
    if (urlELements.length !== 3) {
      return errorHandler(res, 404, "無此路由");
    }
    const id = urlELements.pop();
    const index = todos.findIndex((e) => e.id === id);
    if (index === -1) {
      return errorHandler(res, 400, "id錯誤");
    }
    todos.splice(index, 1);
    return successHandler(res, 200, todos);
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    let data;
    req.on("end", () => {
      try {
        data = JSON.parse(body);
      } catch (e) {
        return errorHandler(res, 400, "JSON解析失敗");
      }
      const { title } = data;
      if (!title || title.toString().trim() === "") {
        return errorHandler(res, 400, "資料格式錯誤 或 輸入為空白");
      }

      const urlELements = req.url.split("/");
      if (urlELements.length !== 3) {
        return errorHandler(res, 404, "無此路由");
      }
      const id = urlELements.pop();
      const index = todos.findIndex((e) => e.id === id);
      if (index === -1) {
        return errorHandler(res, 400, "id錯誤");
      }
      todos[index].title = title.toString().trim();
      return successHandler(res, 200, todos);
    });
  } else {
    return errorHandler(res, 404, "無此路由");
  }
}
const server = http.createServer(requestListener);
server.listen(3005, () => {
  console.log("server is running.");
});
