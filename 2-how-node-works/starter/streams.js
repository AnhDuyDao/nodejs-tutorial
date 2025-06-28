const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
   // Solution 1
   // fs.readFile("test-file.txt", (err, data) => {
   //    if (err) console.log(err);
   //    res.end(data);
   // });
   // Solution 2: Streams
   // const readable = fs.createReadStream("test-file.txt");
   // readable.on("data", (chunk) => {
   //    res.write(chunk);
   // });
   // readable.on("end", () => {
   //    res.end();
   // });
   // readable.on("error", (err) => {
   //    console.log(err);
   //    res.statusCode = 500;
   //    res.end("File not found!");
   // });

   // Solution 3: Address Backpressure Problem (The response can not send the data fast enough to the client when the data is ready because of the fast readable stream)
   const readable = fs.createReadStream("test-file.txt");
   readable.pipe(res);
   // readableSource.pipe(writeableDest)
});

server.listen(8000, "127.0.0.1", () => {
   console.log("Listening...");
});
