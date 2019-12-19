// var osc = require('node-osc');


// import express from 'express';
// import http from "http";
// import socketio from "socket.io";

// const host:any = process.env.HOST || '0.0.0.0'
// const port = process.env.PORT || 3000

// const app: express.Express = express();

// const server = http.createServer(app)
// const io: socketio.Server = socketio(server);

// server.listen(port, host);


// var sendCount = 0;
// // var oscClient = new osc.Client('133.27.78.91', 6000);
// var oscServer = new osc.Server(5000);


// oscServer.on("message", function (msg:any, rinfo:any) {

//     console.log(msg);
//     for(var i=0; i<msg.length; i++) {
//         console.log(msg[i]);
//     }
//     var sendMsg =  new osc.Message('/address');
//     sendMsg.append("test");
//     sendMsg.append(sendCount);
//     // oscClient.send(sendMsg);
//     sendCount++;
// });

// io.on("connection", (socket: socketio.Socket) => {
//     console.log('cc')
//     io.emit('recive_beat', 'aa');
// });

// module.exports = { path: '/api', handler: app }
// app.get('/hello', (req:any, res:any) => {
//     console.log('hello nuxt in text')
//     res.send('world')
// })
