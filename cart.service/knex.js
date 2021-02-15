const fs = require('fs')
const path = require('path')
const mustache = require("mustache")
const { mapValues, range } = require('lodash')

const knex = require('knex')({
    client: 'pg',
    pool: { min: 5, max: 10 },
    connection: {
        host: process.env.PG_LOG_HOST,
        port: process.env.PG_LOG_PORT || 5432,
        user: 'cart',
        password: 'cart',
        database: 'cart'
    }
})

/*
const SQL = ['get', 'upsert']
    .reduce((acc, x) => {
        acc[x] = fs.readFileSync(path.resolve(__dirname, 'sql', x) + '.sql', 'utf-8')
        return acc
    }, {})
*/

const sqlFn = mapValues({ '__get_cart': ['INTEGER']
                        , '__upsert_cart': ['JSON','JSON','JSON'] },
    (v, k) => {
        let str = fs.readFileSync(path.resolve(__dirname, 'sql', k) + '.sql', 'utf-8')
        let qus = v.map(x => `?::${x}`).join(', ')
        return {
            create: mustache.render(str, { func_name: k }),
            query: `select ${k}(${qus});`
        }
    })

class CartService {
    constructor() {
        this.k = knex
    }
    async init() {
        let stms = Object.keys(sqlFn).map(x => sqlFn[x])
        await Promise.all(stms.map(async ({create}) => await this.k.raw(create)))
    }
    async allUserId() {
        let r = await this.k.raw("select id from agent;")
        return r.rows.map(x => x.id)
    }
    async get(userId) {
        //let {rows: [rv]} = await this.k.raw(SQL.get, userId)
        let { rows: [rv] } = await this.k.raw(sqlFn['__get_cart']['query'], [userId])
        return rv
    }
    async set({user, product, cart}) {
        //let { rows: [rv] } = await this.k.raw(SQL.upsert, userId)
        try {
            let {rows: [{__upsert_cart}]} = await this.k.raw(sqlFn['__upsert_cart']['query'], [user, product, cart].map(JSON.stringify))
            return __upsert_cart
        } catch(e) {
            console.log(e)
        }
    }
}

module.exports = { CartService }