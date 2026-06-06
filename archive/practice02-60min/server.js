const http = require("http");
const errorHandler = require("./errorHandler");
const successHandler = require("./successHandler");
const header = require('./header')
const { v4: uuidv4 } = require("uuid");
const todos = [
  {
    title: "寫作業",
    id: uuidv4(),
  },
];
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
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const urlArr = req.url.split("/");
    if (urlArr.length !== 3) {
      return errorHandler(res, 404, "無此路由");
    }
    const id = urlArr.pop();
    const index = todos.findIndex((element) => element.id === id);
    if (index === -1) {
      return errorHandler(res, 400, "無此id");
    }
    todos.splice(index, 1);
    return successHandler(res, 200, todos);
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return errorHandler(res, 400, "JSON解析失敗");
      }
      const title = data.title;
      if (typeof title !== "string" || title.trim() === "") {
        return errorHandler(res, 400, "資料格式錯誤 或 輸入為空");
      }
      todos.push({
        title: title.trim(),
        id: uuidv4(),
      });
      return successHandler(res, 201, todos);
    });
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    const urlArr = req.url.split("/");
    if (urlArr.length !== 3) {
      return errorHandler(res, 404, "無此路由");
    }
    const id = urlArr.pop();
    const index = todos.findIndex((element) => element.id === id);
    if (index === -1) {
      return errorHandler(res, 400, "無此id");
    }
    req.on("end", () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return errorHandler(res, 400, "JSON解析失敗");
      }
      const title = data.title;
      if (typeof title !== "string" || title.trim() === "") {
        return errorHandler(res, 400, "資料格式錯誤 或 輸入為空");
      }
      todos[index].title = title.trim();
      return successHandler(res, 200, todos);
    });
  } else {
    return errorHandler(res, 404, "無此路由");
  }
}
const server = http.createServer(requestListener);
server.listen(8080, () => {
  console.log("server is running.");
});
