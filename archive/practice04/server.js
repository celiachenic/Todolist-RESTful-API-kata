const header = require("./header");
const errorHandler = require("./errorHandler");
const successHandler = require("./successHandler");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const todos = [
  {
    title: "寫作業",
    id: uuidv4(),
  },
  {
    title: "買菜",
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
    const urlElement = req.url.split("/");
    if (urlElement.length !== 3) return errorHandler(res, 404, "路由不存在");

    const id = urlElement[2];
    const index = todos.findIndex((e) => e.id === id);
    if (index === -1) return errorHandler(res, 400, "無此id");

    todos.splice(index, 1);
    return successHandler(res, 200, todos);
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return errorHandler(res, 400, "JSON 解析失敗");
      }
      const { title } = data;
      if (!title || title.toString().trim() === "") {
        return errorHandler(res, 400, "資料格式錯誤");
      }
      todos.push({
        title,
        id: uuidv4(),
      });
      return successHandler(res, 201, todos);
    });
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    const urlElement = req.url.split("/");
    if (urlElement.length !== 3) return errorHandler(res, 400, "路由錯誤");
    const id = urlElement[2];
    const index = todos.findIndex((e) => e.id === id);
    if (index === -1) return errorHandler(res, 400, "id錯誤");
    req.on("end", () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return errorHandler(res, 400, "JSON 解析失敗");
      }
      const { title } = data;
      if (!title || title.toString().trim() === "") {
        return errorHandler(res, 400, "資料格式錯誤");
      }
      todos[index].title = title;
      return successHandler(res, 200, todos);
    });
  } else {
    return errorHandler(res, 404, "路由不存在");
  }
}
const server = http.createServer(requestListener);

server.listen(8080, () => {
  console.log("server is running.");
});
