/*
CREATE TABLE graphql (
	id serial PRIMARY KEY,
	c_time TIMESTAMP,
	req_time INTEGER,
	ip INET,
  url JSONB,
  guest JSONB,
  ua TEXT,
  args JSONB
);

CREATE INDEX idx_gq_ctime ON graphql USING brin(c_time);
CREATE INDEX idx_gq_url ON graphql USING gin(url);
CREATE INDEX idx_gq_guest ON graphql USING gin(guest);
CREATE INDEX idx_gq_args ON graphql USING gin(args);
CREATE INDEX idx_gq_reqtime ON graphql (req_time);
*/

/*
SELECT url->>'value' as api, avg(req_time) FROM graphql GROUP BY url ORDER BY avg DESC;
*/

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.PG_LOG_HOST,
        port: process.env.PG_LOG_PORT || 5432,
        user: 'logger',
        password: 'logger',
        database: 'log'
    }
})

const { get } = require('lodash/fp')
const {format} = require('date-fns')



module.exports = async ({start, end}, [, arg, ctx, s], result, fn) => {
    let ip = ctx.ip, ua = ctx.ua, uid = get(['jwt', 'id'])(ctx), fieldName = get(['fieldName'])(s)
    await knex('graphql').insert({
        c_time: start,
        req_time: end-start,
        ip,
        url: { type: 'graphql', value: fieldName},
        guest: { id: uid},
        ua,
        args: arg
    })
}