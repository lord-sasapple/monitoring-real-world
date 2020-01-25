<template>
    <section>
        <h1 class="header">Nuxt TypeScript Starter</h1>
        <button @click="emitSocket">click!</button>
    </section>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from "nuxt-property-decorator"
import { State } from "vuex-class"
import socket from '~/plugins/socket.io.ts'
const insecam = require('insecam-api');

@Component
export default class extends Vue{
    mounted() {
        socket.on('port_num',function(data:any){
            console.log(data)
        })
        socket.on('host_name',function(data:any){
            console.log(data)
        })
        socket.on('recive_beat',function(data:any){
            console.log(data)
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
</style>
