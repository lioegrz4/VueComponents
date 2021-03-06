import { upperFirst } from 'lodash/fp'
const socketioListeners = {}
global.SOCKETIO_LISTENER = socketioListeners

export const socketIO = prefix => ({
    type: 'socket.io',
    handler({setter, getter, client, after, before}, prop) {
        let ev = prefix ? `${prefix}#${prop}` : prop
        let evt = prefix ? `${prefix}#_${prop}` : `_${prop}`
        let init = (ctx) => {
            ctx.rootGetters['socketio/client'].on(ev, (data, fn) => {
                if (true) console.log(`${prefix}#${prop} receive: `, data)
                before && before(ctx, data)
                if (data===null) return
                setter(ctx, data)
                fn && fn(true)
                after && after(ctx, data)
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
