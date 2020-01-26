import http from 'http'
import socketIO from 'socket.io'
var osc = require('node-osc');
// var oscsender = require('omgosc');
// var sender = new oscsender('133.27.22.27', 57111);
// var sender = new oscsender.UdpSender('133.27.78.102', 10000);
// var receiver = new oscsender.UdpReceiver(7777);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'
var oscServer = new osc.Server(PORT, HOST);
// var oscClient = new osc.Client('133.27.22.27', 57111)

let images = [
    // "http://180.52.63.216:50000/SnapshotJPEG?Resolution=640x480&amp;Quality=Clarity&amp;1579209520.jpg",
    // "http://128.28.102.107:6002/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1579210038.jpg",
    "http://106.172.137.40:8001/SnapshotJPEG?Resolution=640x480&amp;Quality=Clarity&amp;1579205816.jpg",
    "http://220.135.115.163:8084/cgi-bin/viewer/video.jpg?r=1580002560",
    // "http://120.51.171.150/SnapshotJPEG?Resolution=640x480&amp;Quality=Clarity&amp;1579210125.jpg",
    "http://133.236.71.250:60001/-wvhttp-01-/GetOneShot?image_size=640x480&frame_count=1000000000",
    "http://211.226.150.90:88/SnapshotJPEG?Resolution=640x480&amp;Quality=Clarity&amp;1580004692",
    "http://203.114.218.5:50001/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1580005183",
    "http://221.120.43.150/webcapture.jpg?command=snap&channel=1?1580005490",
    "http://61.214.197.204:1024/-wvhttp-01-/GetOneShot?image_size=640x480&frame_count=1000000000",
    "http://121.180.45.81/snap.jpg?JpegSize=M&JpegCam=1&r=1580005862",
    "http://113.35.143.114:50000/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1580006106",
    "http://112.197.81.164:86/webcapture.jpg?command=snap&channel=1?1580008047",
    // "http://145.53.212.190:8001/mjpg/video.mjpg",
    // "http://118.111.199.166:83/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;0",
    // "http://126.149.232.164:50001/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1580000970",
    // "http://153.155.7.150/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1580001135",
    // "http://114.186.207.140:50000/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1580001243",
    // "http://153.217.1.139:8084/-wvhttp-01-/GetOneShot?image_size=640x480&frame_count=1000000000",
    // "http://153.217.1.139:8081/-wvhttp-01-/GetOneShot?image_size=640x480&frame_count=1000000000",
    // "http://114.184.118.121:50001/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1580001414",
    // "http://180.44.138.112:50001/SnapshotJPEG?Resolution=640x480&amp;Quality=Clarity&amp;1580001478",
    // "http://123.226.235.110:8081/cgi-bin/faststream.jpg?stream=half&fps=15&rand=COUNTER",
    // "http://115.176.133.98:8080/-wvhttp-01-/GetOneShot?image_size=640x480&frame_count=1000000000",
    // "http://219.165.142.88/-wvhttp-01-/GetOneShot?image_size=640x480&frame_count=1000000000",
    // "http://175.28.208.61/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1580001709",
    // "http://114.134.54.48:8080/cgi-bin/camera?resolution=640&amp;quality=1&amp;Language=0&amp;1580001757",
    // "http://27.135.30.50/-wvhttp-01-/GetOneShot?image_size=640x480&frame_count=1000000000",
];

// const insecam = require('insecam-api');

// const getNewCam = () => {
//     return new Promise((resolve, reject)=>{
//         insecam.countries.then((res)=>{
//             const countries = Object.entries(res);
//             const randomCountry = countries[Math.floor(Math.random() * countries.length)][0];
//             insecam.country(randomCountry).then((res)=>{
//                 insecam.camera(res[0]).then((res)=>{
//                     images.push(res.image);
//                     resolve(res.image)
//                     // switch (res.manufacturer){
//                     //     case "Defeway":
//                     //         images.push(res.image);
//                     //         resolve(res.image)
//                     //         break;
//                     //     case "Panasonic":
//                     //         images.push(res.image);
//                     //         resolve(res.image)
//                     //         break;
//                     //     case "Vivotek":
//                     //         images.push(res.image);
//                     //         resolve(res.image)
//                     //         break;
//                     //     case "Megapixel":
//                     //         images.push(res.image);
//                     //         resolve(res.image)
//                     //         break;
//                     //     default:
//                     //         getNewCam()
//                     //         break;
//                     // }
//                 });
//             }).catch((err)=>{
//                 reject(err);
//             });
//         }).catch((err)=>{
//             reject(err);
//         });
//     });
// }

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
            // io.emit('port_num', PORT);
            // io.emit('host_name', HOST)
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
                // sender.send(
                //     '/test',
                //     'sfiTFNI',
                //     ['hello', 3, 1, true, false, null, undefined]
                // );
            });
        })
        oscServer.on("message", function (msg, rinfo) {

            console.log('osc recived');
            const randomImg = images[Math.floor(Math.random() * images.length)]
            io.emit('recive_beat', randomImg);
            console.log(randomImg)
            // getNewCam()
        });
    })
}