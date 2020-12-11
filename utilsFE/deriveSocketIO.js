const socketioListeners = {}
global.SOCKETIO_LISTENER = socketioListeners

export const socketIO = {
    type: 'socket.io',
    handler({setter, getter, client}, prop) {
        let init = (ctx) => {
            ctx.rootGetters['socketio/client'].on(prop, (data, fn) => {
                setter(ctx, data)
                fn(true)
            })
        }
        let action = async(ctx, ...args) => {
            await setter(ctx, await getter(ctx, ...args))
        }
        socketioListeners[prop] = action
        return { init, action }
    }
}

export const socketIOEmit = {
    type: 'socket.io/emit',
    handler({}, prop) {
        return (ctx, ...args) => {
            ctx.rootGetters['socketio/client'].emit(prop, ...args)
        }
    }
}