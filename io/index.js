import http from 'http'
import socketIO from 'socket.io'
var osc = require('node-osc');
var oscsender = require('omgosc');
// var sender = new oscsender('133.27.22.27', 57111);
var sender = new oscsender.UdpSender('133.27.78.102', 10000);
var receiver = new oscsender.UdpReceiver(7777);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'
var oscServer = new osc.Server(PORT, HOST);
var oscClient = new osc.Client('133.27.22.27', 57111)

let images = [
    "http://180.52.63.216:50000/SnapshotJPEG?Resolution=640x480&amp;Quality=Clarity&amp;1579209520.jpg",
    "http://128.28.102.107:6002/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1579210038.jpg",
    "http://106.172.137.40:8001/SnapshotJPEG?Resolution=640x480&amp;Quality=Clarity&amp;1579205816.jpg",
    "http://120.51.171.150/SnapshotJPEG?Resolution=640x480&amp;Quality=Clarity&amp;1579210125.jpg",
];

const insecam = require('insecam-api');

const getNewCam = () => {
    return new Promise((resolve, reject)=>{
        insecam.countries.then((res)=>{
            const countries = Object.entries(res);
            const randomCountry = countries[Math.floor(Math.random() * countries.length)][0];
            insecam.country(randomCountry).then((res)=>{
                insecam.camera(res[0]).then((res)=>{
                    images.push(res.image);
                    resolve(res.image)
                    // switch (res.manufacturer){
                    //     case "Defeway":
                    //         images.push(res.image);
                    //         resolve(res.image)
                    //         break;
                    //     case "Panasonic":
                    //         images.push(res.image);
                    //         resolve(res.image)
                    //         break;
                    //     case "Vivotek":
                    //         images.push(res.image);
                    //         resolve(res.image)
                    //         break;
                    //     case "Megapixel":
                    //         images.push(res.image);
                    //         resolve(res.image)
                    //         break;
                    //     default:
                    //         getNewCam()
                    //         break;
                    // }
                });
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}

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
            });
        })
        oscServer.on("message", function (msg, rinfo) {

            console.log(msg);
            const randomImg = images[Math.floor(Math.random() * images.length)]
            io.emit('recive_beat', randomImg);
            console.log(randomImg)
            getNewCam()
        });
    })
}