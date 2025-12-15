// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // path tới db.json
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Middleware map pageNumber/pageSize -> _page/_limit
server.use((req, res, next) => {
  const { pageNumber, pageSize } = req.query;

  if (pageNumber) {
    req.query._page = pageNumber;
    delete req.query.pageNumber;
  }

  if (pageSize) {
    req.query._limit = pageSize;
    delete req.query.pageSize;
  }

  next();
});

// Dùng router mặc định của json-server
server.use(router);

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Mock API is running at http://localhost:${PORT}`);
});
