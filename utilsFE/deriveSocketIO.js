const socketioListeners = {}
global.SOCKETIO_LISTENER = socketioListeners

export const socketIO = prefix => ({
    type: 'socket.io',
    handler({setter, getter, client}, prop) {
        let ev = prefix ? `${prefix}#${prop}` : prop
        let init = (ctx) => {
            ctx.rootGetters['socketio/client'].on(ev, (data, fn) => {
                if (true) console.log(`${prefix}#${prop} receive: `, data)
                setter(ctx, data)
                fn&&fn(true)
            })
        }
        let action = async(ctx, ...args) => {
            let v = await getter(ctx, ...args)
            typeof v !== 'undefined' && await setter(ctx, v)
        }
        let trigger = (ctx, arg) => {
            ctx.rootGetters['socketio/client'].emit(ev, arg)
        }
        socketioListeners[prop] = action
        return { init, action, trigger }
    }
})
