
const { mapValues, get } = require('lodash/fp')

const { transHttp } = require('./transHttp')

const gqUserId = fn => async (root, arg, ctx, ...rest)=>{
    return await fn( (...a) => transHttp(...a).userId(ctx).withQ(ctx, {debug: 1})
                   , arg
                   , root
                   , ctx
                   , ...rest)
}
const gqWrapper = fn => async (root, arg, ctx, ...rest)=>{
    return await fn( (...a) => transHttp(...a).withQ(ctx, {debug: 1})
                   , arg
                   , root
                   , ctx
                   , ...rest)
}

const Logger = cb => fn => async (...args)=>{
    let s = new Date()
    let r = await fn(...args)
    if (cb) await cb({start:s, end: new Date()}, args, r, fn)
    return r
}

const { wraps, log } = require('./lambda')
const logr = ({start, end}, [, arg, ctx, s], result, fn) => {
    let ip = ctx.ip, ua = ctx.ua, uid = get(['jwt', 'id'])(ctx), fieldName = get(['fieldName'])(s)
    log(end-start
       , `\nuid: ${uid}`
       , `\nip: ${ip}`
       , `\nua: ${ua}`
       , `\narg: ${JSON.stringify(arg, null, 4)}`
       , `\nfield: ${fieldName}`)
}

const log2pg = require('./log2pg')

let logg = process.env.PG_LOG_HOST ? log2pg : logr

const genModuleWrapper = (...m) => obj => {
    return mapValues(x => {
        return mapValues(y => {
            return wraps(...m)(y)
        })(x)
    })(obj)
}

const wrapAllGqHandlers = genModuleWrapper(gqUserId, Logger(logg))
const wrapAllGqHandlersWithoutId = genModuleWrapper(gqWrapper, Logger(logg))
module.exports = {
    gqUserId, Logger, wraps, logr, wrapAllGqHandlers, wrapAllGqHandlersWithoutId
}


