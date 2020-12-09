export const importCtx = handler => ctx => {
    return ctx.keys().map(handler(ctx))
}
import { get } from 'lodash/fp'

import Vue from 'vue'
export const vueImportHanlder = requireComponent => fileName => {
    const m = requireComponent(fileName)
    const n = fileName.replace(/\.\/(.+)\/index.vue$/g, "$1")
    Vue.component(n, m.default || m)
}
export const importComponents = importCtx(vueImportHanlder)

import Vuex from 'vuex'
Vue.use(Vuex)
export const importVuex = requireComponent => {
    let modules = {}, init = []
    requireComponent.keys().forEach(fileName => {
        const m = requireComponent(fileName)
        const n = fileName.replace(/\.\/(.+)\.js$/g, "$1")
        modules[n] = m.default || m
        if (get([n, 'actions', '__init__'])(modules)) {
            init.push(`${n}/__init__`)
        }
    })
    let store = new Vuex.Store({ modules })
    return { store, init }
}

import VueRouter from 'vue-router'
export const importRouter = (cfg, requireComponent) => {
    let routes = {}
    requireComponent.keys().forEach(fileName => {
        console.log(fileName)
    })
    return new VueRouter(Object.assign({ routes }, cfg))
}