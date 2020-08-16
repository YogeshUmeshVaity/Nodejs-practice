const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
      res.write('<html>');
      res.write('<head><title>Enter Message</title><head>');
      res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
      res.write('</html>');
      return res.end();
    }
    if (url === '/message' && method === 'POST') {
      const body = []; 
      // on() allows us to listen for certain events. We listen to 'data' event here.
      // The 'data' event is fired whenever a new chunk is ready to be read.
      // We specify what to do with the chunk in the listener code.
      req.on('data', (chunk) => {
        console.log(chunk);
        body.push(chunk);
      });
      // 'end' event will fire once it is done parsing the incoming request. 
      // We are using this to make sure we have a complete incoming data in the body array.
      // Now we work with the chunks of the data that we collected.
      // The chunk is a Buffer which contains binary data. So, the array we created above is for
      // the buffers.
      // The concat() returns a Buffer object which is binary data. To convert it to string, we call
      // toString() on the Buffer.
      req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split('=')[1]; // e.g. message=Welcome we need the 'Welcome' part here.
        fs.writeFileSync('message.txt', message);
      });
      res.statusCode = 302;
      res.setHeader('Location', '/');
      return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title><head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
  }

  exports.handler = requestHandler