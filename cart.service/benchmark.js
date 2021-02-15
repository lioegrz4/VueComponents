const { CartService } = require('./knex')
const Y = require('js-yaml')
let s1 = new Date(), s2, s3, s4, s5, stat = { s1: [], s2: [], s3: [], s4: [], s5: [] }
let x = new CartService()
let uss = id => ({
    user: { id: 123+Math.floor(Math.random()*100000+10000), "name": "abc"+Math.random()*100000+10000 },
    product: [{ "name": "p1", "id": id, "sku": [14323, 324, 27834478, 543] }, { "name": "p2", "id": 232433, "sku": [12333, 343264, 54473] }, { "name": "p3", "id": 4435, "sku": [1283, 3824, 5483] }],
    cart: [{ "id": 12333, "quantity": 324, "checked": true }, { "id": 543, "quantity": 324, "checked": true }, { "id": 54473, "quantity": 324, "checked": true }, { "id": 5447553, "quantity": 324, "checked": true }]
})
let usss = []
for (let i =0; i< 10; i++) {
    usss.push(uss(Math.floor(Math.random()*100000+10000)))
}
x.init()
    .then(_ => {
        return x.allUserId()
    })
    .then(async us => {
        s2 = new Date()
        stat.s1.push(s2 - s1)
        let r1 = Promise.all(usss.map(i => x.set(i).then(r => stat.s2.push(new Date()-s2))))
        s3 = new Date()
        await Promise.all(us.map(n => x.get(n).then(r => stat.s3.push(new Date() - s3))))
        s4 = new Date()
        await Promise.all(us.map(n => x.get(n).then(r => stat.s4.push(new Date() - s4))))
        s5 = new Date()
        await Promise.all(us.map(n => x.get(n).then(r => stat.s5.push(new Date() - s5))))
        return us
    })
    .then((us) => {
        for (let i in stat){
            stat[i] = stat[i].slice(0,10)
        }
        stat['count'] = us.length
        stat['total'] = new Date() - s1
        console.log(Y.dump(stat, { flowLevel: 1 }))
        process.exit()
    })

/*
s1: [15]
s2: [8, 10, 10, 10, 10, 10, 10, 10, 11, 12, 12, 12, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14]
s3: [3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8]
s4: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7]
s5: [5, 5, 5, 5, 5, 5, 5, 8, 8, 8, 9, 9, 9, 9, 9, 9, 10, 11, 11, 11, 11, 11, 11, 11, 11]
count: 25
total: 55
*/