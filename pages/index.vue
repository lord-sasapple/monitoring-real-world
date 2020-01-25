<template>
    <div>
        <h1 class="header" v-if="this.imgUrl === ''"
        crossorigin='anonymous'>monitoring-real-world</h1>
        <!-- <button @click="emitSocket">click!</button> -->
        <div class="detected-obj">{{ this.detectedObj }}</div>
        <div class="detected-score">{{ this.detectedScore }}</div>
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
    detectedObj: string[] = [];
    detectedScore: string[] = [];
    canvas:any;
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
            self.detectObject(data).then((res:any)=>{
                console.log(res);
                if (res[0]){
                    self.detectedObj.push(res[0].class);
                    self.detectedScore.push(res[0].score);
                }
            }).catch((err:any)=>{
                console.error(err);
            });
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

.detected-obj,
.detected-score{
    color: white;
    font-weight: bold;
}
</style>
