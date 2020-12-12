import * as http from 'http';

const server = http.createServer((req, res) => {
  console.log('Request made to:' + req.url);
});

server.listen(3000, 'localhost', () => {
  console.log('listening for requests on port 3000');
});
