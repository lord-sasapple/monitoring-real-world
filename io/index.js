import http from 'http'
import socketIO from 'socket.io'
var osc = require('node-osc');


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'
var oscServer = new osc.Server(PORT, HOST);


export default function () {
    this.nuxt.hook('render:before', (renderer) => {
        const server = http.createServer(this.nuxt.renderer.app)
        const io = socketIO(server)

        // overwrite nuxt.server.listen()

        this.nuxt.server.listen = (port, host) => new Promise(resolve => {
            server.listen(PORT, HOST, resolve)
        })
        // close this server on 'close' event
        this.nuxt.hook('close', () => new Promise(server.close))

        // Add socket.io events
        const messages = []
        io.on('connection', (socket) => {
            io.emit('port_num', PORT);
            socket.on('last-messages', function (fn) {
                fn(messages.slice(-50))
            })
            socket.on('send-message', function (message) {
                messages.push(message)
                socket.broadcast.emit('new-message', message)
            })
        })

        console.log('oscServer', oscServer);

        oscServer.on("message", function (msg, rinfo) {

            // console.log(msg);
            for(var i=0; i<msg.length; i++) {
                // console.log(msg[i]);
            }
            io.emit('recive_beat', msg[1]);
        });
    })
}