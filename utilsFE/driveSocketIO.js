const socketioListeners = {}
global.SOCKETIO_LISTENER = socketioListeners

export const deriveSocketIO = {
    type: 'socket.io',
    handler({setter, getter, client}, prop) {
        let init = ({rootGetters}) => {
            rootGetters['socketio/client'].on(prop, getter)
        }
        let action = async(ctx, ...args) => {
            await setter(ctx, await getter(ctx, ...args))
        }
        socketioListeners[prop] = action
        return { init, action }
    }
}