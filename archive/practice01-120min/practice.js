const http = require("http");
const { v4: uuidv4 } = require("uuid");
const successHandle = require("./successHandle");
const errorHandle = require("./errorHandle");

const todos = [
  {
    title: "拿包裹",
    id: uuidv4(),
  },
];

function requestListener(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  //OPTIONS Request
  if (req.method === "OPTIONS") {
    res.writeHead(200, header);
    return res.end();
  } //取得所有待辦事項
  else if (req.url === "/todos" && req.method === "GET") {
    return successHandle(res, 200, todos);
  } //刪除所有待辦事項
  else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    return successHandle(res, 200, todos);
  } //刪除單筆待辦事項
  else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((e) => e.id === id);
    if (index === -1) {
      return errorHandle(res, 400, "無此id");
    } else {
      todos.splice(index, 1);
      return successHandle(res, 200, todos);
    }
  } //新增單筆待辦事項
  else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        if (!title || title.trim() === "") {
          return errorHandle(res, 400, "格式錯誤 或 輸入為空白");
        } else {
          todos.push({
            title,
            id: uuidv4(),
          });
          return successHandle(res, 201, todos);
        }
      } catch (e) {
        return errorHandle(res, 400, "格式錯誤");
      }
    });
  } //編輯單筆待辦事項
  else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((e) => e.id === id);
    if (index === -1) {
      return errorHandle(res, 400, "無此id");
    }
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        if (!title || title.trim() === "") {
          return errorHandle(res, 400, "格式錯誤 或 輸入為空白");
        } else {
          todos[index].title = title;
          return successHandle(res, 200, todos);
        }
      } catch (e) {
        return errorHandle(res, 400, "格式錯誤");
      }
    });
  } //其他路由
  else {
    return errorHandle(res, 404, "無此路由");
  }
}
const server = http.createServer(requestListener);
server.listen(8080, () => {
  console.log("server is running");
});
