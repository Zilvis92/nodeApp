const http = require('http');
const fs = require('fs');

// const server = http.createServer((req, res) => {
//     console.log(req.url, req.method);
//     res.setHeader('Content-Type', 'text/html');
//     fs.readFile('./views/index.html', (err, data) => {
//         if (err) {
//             console.log(err);
//             res.end();
//         } else {
//             res.end(data);
//         }
//     });
// });

// server.listen(3001, 'localhost', () => {
//     console.log('Server is running on http://localhost:3001');
// });

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    res.setHeader('Content-Type', 'text/html');

    let path = './views/';
    switch (req.url) {
        case '/':
        case '/index.html':
            path += 'index.html';
            res.statusCode = 200;
            break;
        case '/apie':
            path += 'apie.html';
            res.statusCode = 200;
            break;
        default:
            path += '404.html';
            res.statusCode = 404;
            break;
    };

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.end(data);
        }
    });
});

server.listen(3001, 'localhost', () => {
    console.log('Server is running on http://localhost:3001');
});