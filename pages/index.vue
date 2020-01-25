<template>
    <div>
        <h1 class="header" v-if="this.imgUrl === ''">monitoring-real-world</h1>
        <!-- <button @click="emitSocket">click!</button> -->
        <img :src="this.imgUrl" alt="">
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from "nuxt-property-decorator"
import { State } from "vuex-class"
import socket from '~/plugins/socket.io.ts'

@Component
export default class extends Vue{
    imgUrl:string = '';
    mounted() {
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
        })
    }
    emitSocket(){
        socket.emit('click', 'clicked!')
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
}
</style>
