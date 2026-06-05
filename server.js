const http = require("http");
const { v4: uuidv4 } = require("uuid"); // 舊版 CommonJS 寫法
const errorHandle = require("./errorHandle");
const todos = [{ title: "今天要刷牙", id: uuidv4() }];
function requestListener(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
    "Content-Type": "application/json",
  };
  if (req.url === "/todos" && req.method === "GET") {
    res.writeHead(200, headers);
    res.write(JSON.stringify({ status: "success", data: todos }));
    res.end();
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        if (title !== undefined) {
          const todo = { title, id: uuidv4() };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({ status: "success", data: todos }));
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (e) {
        errorHandle(res);
      }
    });
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({ status: "success", data: todos }));
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    //.pop()會刪除陣列最後一筆資料並將該筆刪除資料回傳，所以id可以拿到"/todos/"後面的uuid
    const id = req.url.split("/").pop();
    const index = todos.findIndex((e) => e.id === id);
    if (index === -1) {
      errorHandle(res);
    } else {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({ status: "success", data: todos }));
      res.end();
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        const id = req.url.split("/").pop();
        const index = todos.findIndex((e) => e.id === id);
        if (title && index !== -1) {
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(JSON.stringify({ status: "success", data: todos }));
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (e) {
        errorHandle(res);
      }
    });
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({ status: "fail", message: "無此網站路由" }));
    res.end();
  }
}
const server = http.createServer(requestListener);
server.listen(3005, () => {
  console.log("server is running");
});
