import * as http from 'http';
import * as fs from 'fs';

const server = http.createServer((req, res) => {
  console.log('Request made to:' + req.url);

  // set header content type
  res.setHeader('Content-Type', 'text/html');

  // send an html file
  fs.readFile('./dist/index.html', (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(3000, 'localhost', () => {
  console.log('listening for requests on port 3000');
});
