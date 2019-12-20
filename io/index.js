import http from 'http'
import socketIO from 'socket.io'
var osc = require('node-osc');
var oscsender = require('omgosc');
// var sender = new oscsender('133.27.22.27', 57111);
var sender = new oscsender.UdpSender('133.27.22.27', 10000);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'
var oscServer = new osc.Server(PORT, HOST);
// var oscClient = new osc.Client('133.27.22.27', 57111)


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
            io.emit('host_name', HOST)
            socket.on('last-messages', function (fn) {
                fn(messages.slice(-50))
            })
            socket.on('send-message', function (message) {
                messages.push(message)
                socket.broadcast.emit('new-message', message)
            })
            socket.on('click', (msg) => {
                console.log(msg)
                // oscClient.send('/test', 'testing', 'testing', 123);

                //'133.27.22.27', 57111
                sender.send(
                    '/test',
                    'sfiTFNI',
                    ['hello', 3, 1, true, false, null, undefined]
                );
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