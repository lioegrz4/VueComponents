const socketioListeners = {}
global.SOCKETIO_LISTENER = socketioListeners

export const deriveSocketIO = {
    type: 'socket.io',
    handler({setter, getter, client}, prop) {
        let init = (ctx) => {
            ctx.rootGetters['socketio/client'].on(prop, x => setter(ctx, x))
        }
        let action = async(ctx, ...args) => {
            let v = await getter(ctx, ...args)
            typeof v !== 'undefined' && await setter(ctx, v)
        }
        socketioListeners[prop] = action
        return { init, action }
    }
}