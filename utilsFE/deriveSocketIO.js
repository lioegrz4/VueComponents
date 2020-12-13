import { upperFirst } from 'lodash/fp'
const socketioListeners = {}
global.SOCKETIO_LISTENER = socketioListeners

export const socketIO = prefix => ({
    type: 'socket.io',
    handler({setter, getter, client}, prop) {
        let ev = prefix ? `${prefix}#${prop}` : prop
        let evt = prefix ? `${prefix}#trigger${upperFirst(prop)}` : `trigger${upperFirst(prop)}`
        let init = (ctx) => {
            ctx.rootGetters['socketio/client'].on(ev, (data, fn) => {
                if (true) console.log(`${prefix}#${prop} receive: `, data)
                if (data===null) return
                setter(ctx, data)
                fn&&fn(true)
            })
        }
        let action = async(ctx, ...args) => {
            let v = await getter(ctx, ...args)
            if (v===null) return
            await setter(ctx, v)
        }
        let trigger = (ctx, arg) => {
            ctx.rootGetters['socketio/client'].emit(evt, arg)
        }
        socketioListeners[prop] = action
        return { init, action, trigger }
    }
})
