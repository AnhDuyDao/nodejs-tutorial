'use strict';
const fs = require('fs');
const http = require('http');
const { type } = require('os');
const path = require('path');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

/*
///////////////////////////////////
Blocking synchronous way
const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreate on ${Date.now()}`;
fs.writeFileSync('./starter/txt/output.txt', textOut);
console.log('File written!');

Non-blocking asynchronous way
fs.readFile('./starter/txt/startttt.txt', 'utf-8', (err, data1) => {
   if (err) return console.log('ERROR! 💥');
   fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
      console.log(data2);
      fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
         console.log(data3);
         fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
            console.log('Your file has been written!');
         })
      });
   });
});
console.log("Will read file!");
///////////////////////////////////////
SERVER

fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
   console.log(data);
});
console.log('Will read file!');
*/

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
   const { query, pathname: pathName } = url.parse(req.url, true);

   // Overview page
   if (pathName === '/' || pathName === '/overview') {
      res.writeHead(200, {
         'Content-typed': 'text/html',
      });

      const cardsHTML = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
      const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);

      res.end(output);
      // Product page
   } else if (pathName === '/product') {
      res.writeHead(200, {
         'Content-typed': 'text/html',
      });
      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct, product);

      res.end(output);
      // API
   } else if (pathName === '/api') {
      res.writeHead(200, {
         'Content-typed': 'application/json',
      });
      // res.end sends the response back to the client with string data type
      res.end(data);
      // Not found
   } else {
      res.writeHead(404, {
         'Content-type': 'text/html',
         'my-own-header': 'hello-world',
      });
      res.end('<h1>Page not found!</h1>');
   }
});

server.listen(8000, '127.0.0.1', () => {
   console.log('Listening to requests on port 8000');
});
