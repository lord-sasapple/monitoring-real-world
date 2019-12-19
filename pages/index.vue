<template>
    <section>
        <h1 class="header">Nuxt TypeScript Starter</h1>
    </section>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from "nuxt-property-decorator"
import { State } from "vuex-class"
import socket from '~/plugins/socket.io.ts'

export default {
    mounted() {
        socket.on('recive_beat',function(data:any){
            console.log(data)
        })
    },
    methods: {
    },
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
