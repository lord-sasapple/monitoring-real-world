<template>
    <div>
        <h1 class="header" v-if="this.imgUrl === ''"
        crossorigin='anonymous'>monitoring-real-world</h1>
        <!-- <button @click="emitSocket">click!</button> -->
        <div v-for="item in detectedArray" :key="item.id" class="detected-obj">
            {{ item }}
        </div>
        <img :src="this.imgUrl" alt="" id="img" width="1600px" height="900px">
        <canvas id="imgCanvas" width="1600px" height="900px">
        Your browser does not support the HTML5 canvas tag.
        </canvas>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from "nuxt-property-decorator"
import { State } from "vuex-class"
import socket from '~/plugins/socket.io.ts'
import axios from 'axios'

@Component
export default class extends Vue{
    imgUrl:string = '';
    detectedArray:any = [];
    canvas:any;
    isDetecting: boolean = false;
    mounted() {
        this.canvas = document.getElementById("imgCanvas");
        const self = this
        socket.on('port_num',function(data:any){
            console.log(data)
        })
        socket.on('host_name',function(data:any){
            console.log(data)
        })
        socket.on('recive_beat',function(data:any){
            console.log(data)
            self.imgUrl = data;
            if (!self.isDetecting){
                console.log('Detecting!')
                self.isDetecting = true;
                self.detectObject(data).then((res:any)=>{
                    console.log(res);
                    self.isDetecting = false;
                    if (res[0] && res[0].class !== 'null'){
                        self.detectedArray.push([res[0].class, res[0].score]);
                    }
                    if (res[1] && res[1].class !== 'null'){
                        self.detectedArray.push([res[1].class, res[1].score]);
                    }
                    if (res[2] && res[2].class !== 'null'){
                        self.detectedArray.push([res[2].class, res[2].score]);
                    }
                    if (res[3] && res[3].class !== 'null'){
                        self.detectedArray.push([res[3].class, res[3].score]);
                    }
                    if (res[4] && res[4].class !== 'null'){
                        self.detectedArray.push([res[4].class, res[4].score]);
                    }
                }).catch((err:any)=>{
                    console.error(err);
                });
            }
        })
    }
    emitSocket(){
        socket.emit('click', 'clicked!')
    }
    detectObject(url:string){
        return new Promise((resolve, reject)=>{
            axios.get('/api/detect', {
                params: {
                    url: url
                }
            }).then((res)=>{
                resolve(res.data)
            }).catch((err)=>{
                reject(err)
            });
        })
    }
}


</script>

<style lang="scss" scoped>
.header {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.cards {
    display: flex;
    flex-wrap: wrap;
}

h1{
    color: white;
}

div {
    background: black;
}


img{
    width: 100%;
    height: 100%;
    // display: none;
}

canvas{
    // width: 100%;
    // height: 100%;
    display: none;
}

.detected-obj{
    color: white;
    font-weight: bold;
}
</style>
