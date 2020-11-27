const axios = require('axios')
const { merge, get } = require('lodash')
const { transData } = require('./transData')
const fs = require('fs')
const path = require('path')
const yml = require('js-yaml')
const { mapValues, property } = require('lodash/fp')
const config = yml.safeLoad(fs.readFileSync(path.resolve(__dirname, 'host.yml'), 'utf-8'))
const ENDPOINT = mapValues(property(['target', process.env.NODE_ENV || 'default']))(config)


const stringifyUrl = ({protocol, host, port, path}) => {
    return `${protocol||'http'}://${host}:${port}/${path}`
}
const parseUrl = url => {
    if (typeof url === 'string') {
        return [url]
    } else if (typeof url === 'object') {
        if (!url.service) {
            return [stringifyUrl(url)]
        } else {
            return [stringifyUrl(Object.assign(ENDPOINT[url.service], url)), url.service]
        }
    }
}
class TransHttp {
    constructor(url) {
        let [u, s] = parseUrl(url)
        this._url = u
        this._service = s
        this._method = undefined
        this._headers = { 'Content-Type': 'application/json' }
        this._mode
    }
    headers(...h) {
        this._headers = merge(...h, this._headers) || {}
        return this
    }
    async _fetchData() {
        try {
            let { data } = await axios({
                url: this._url,
                method: this._method,
                headers: this._headers,
                ...this._payload,
                ...this._mode
            })
            return data
        } catch (e) {
            throw new Error(`服务器: ${e.response.data}`)
        }
    }
    async trans(schema) {
        if (this._inspector) this._inspector()
        let data = await this._fetchData()
        if (this._inspector) this._inspector(data)
        if (!schema) return data
        if (typeof schema === 'function') return schema(data)
        if (typeof schema === 'object') return transData(schema, data)
    }
    get(...args) {
        this._method = 'get'
        this._payload = { params: merge(...args) }
        return this
    }
    post(...args) {
        this._method = 'post'
        this._payload = { data: merge(...args) }
        return this
    }
    put(...args) {
        this._method = 'put'
        this._payload = { data: merge(...args) }
        return this
    }

    inspect(fn) {
        let req = {
            url: this._url,
            method: this._method,
            headers: this._headers,
            ...this._payload,
        }
        this._inspector = fn
                        ? returnValue => fn({...req, returnValue})
                        : returnValue => console.log('>>> transHttp inspect: ', req)
        return this
    }


    withQ(ctx, q) {
        if (get(ctx, ['ua'])!=='debug') return this
        this._mode = {
            params: q
        }
        return this
    }

    userId(ctx, prop = "USERINFO") {
        let uid = get(ctx, ['jwt', 'id'])
        let confProp = this._service && config[this._service].auth
        return uid
            ? this.headers({
                [confProp || prop]: uid
            })
            : this
    }
}

module.exports = {
    transHttp(url) {
        return new TransHttp(url)
    }
}