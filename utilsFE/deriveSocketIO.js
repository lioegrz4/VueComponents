const socketioListeners = {}
global.SOCKETIO_LISTENER = socketioListeners

export const socketIO = {
    type: 'socket.io',
    handler({setter, getter, client}, prop) {
        let init = (ctx) => {
            ctx.rootGetters['socketio/client'].on(prop, (data, fn) => {
                setter(ctx, data)
                fn&&fn(true)
            })
        }
        let action = async(ctx, ...args) => {
            let v = await getter(ctx, ...args)
            typeof v !== 'undefined' && await setter(ctx, v)
        }
        socketioListeners[prop] = action
        return { init, action }
    }
}

export const socketIOEmit = {
    type: 'socket.io/emit',
    handler({}, prop) {
        return (ctx, arg) => {
            ctx.rootGetters['socketio/client'].emit(prop, arg)
        }
    }
}