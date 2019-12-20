import {Configuration} from '@nuxt/types'

const nuxtConfig = {
  router: {
    base: 'monitoring-real-world-hosting'
  },
  mode: 'universal',
  env: {
    WS_URL: process.env.WS_URL || 'http://localhost:3000'
  },
  head: {
    title: "monitoring-real-world",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js TypeScript project" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },
  loading: { color: "#3B8070" },
  css: ["~/assets/css/main.css"],
  build: {
    vendor: ['socket.io-client']
  },
  buildModules: ["@nuxt/typescript-build"],
  modules: [
    "@nuxtjs/axios",
    "~/io",
  ],
  axios: {},
  serverMiddleware: ['~/api/index.ts'],
}

module.exports = nuxtConfig