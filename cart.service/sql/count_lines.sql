WITH
 p as (select count(*) as product from product),
 c as (select count(*) as cart    from cart),
 l as (select count(*) as line    from cart_line),
 u as (select count(*) as user    from agent)
select * from p, c, l, u
;