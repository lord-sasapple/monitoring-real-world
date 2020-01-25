const express = require('express');
const app = express();
import http from 'http'

import * as cocoSsd from '@tensorflow-models/coco-ssd';

const Canvas = require('canvas'),
    Image = Canvas.Image;

app.get("/detect", (req:any, res:any) => {
    detectImg(req.query.url).then((result)=>{
        res.json(result)
    }).catch(err=>{
        res.send('sorry...')
    })
})

module.exports = {
    path: '/api',
    handler: app
}

function detectImg(url:string){
    return new Promise ((resolve, rejcet)=>{
        loadImage(url).then((avater:any)=>{
            var canvas = Canvas.createCanvas(avater.width, avater.height);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(avater, 0, 0, avater.width, avater.height);
            // tf.browser.fromPixels(canvas).print();
            cocoSsd.load().then((model)=>{
                model.detect(canvas).then((predictions)=>{
                    resolve(predictions)
                }).catch((err)=>{
                    console.log('err', err)
                    rejcet(err)
                })
            }).catch((err)=>{
                rejcet(err)
            })
        })
    })
}

function loadImage (url:string) {
    return new Promise((resolve, reject) => {
        const img = new Canvas.Image()
    
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Failed to load image'))
    
        http.get(url, (res) => {
            let chunks:Uint8Array[] = []
    
            res.on('error', (err) => { reject(err) })
            res.on('data', (chunk) => { chunks.push(chunk) })
            res.on('end', () => { img.src = Buffer.concat(chunks) })
        })
    })
}