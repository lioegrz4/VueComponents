CREATE OR REPLACE FUNCTION {{func_name}}(JSON, JSON, JSON)
RETURNS INTEGER[] AS $$
DECLARE rv INTEGER[];
BEGIN
        WITH args AS (
            select * from (values ( $1, $2, $3 )) as arg (agent, product, update_list )
        ), al as (
            select name, id, now()
            from args, json_to_record(args.agent::JSON) as x(name text, id integer)
        ), pl as (
          select name, id, sku, now()
          from args, json_to_recordset(args.product::JSON) as x(name text, id integer, sku integer[])
        ), ps as (
          select id as product_id, unnest(sku) as id
          from pl
        ), ul as (
          select id, quantity, checked, now() as updated
          from args, json_to_recordset(args.update_list::JSON) as x(id integer, quantity integer, checked boolean)
        ), agent AS (
          insert into agent (name, id)
            select name, id from al
          on conflict (id) do nothing
        ), cart AS (
          insert into cart (agent_id)
            select id from al
          on conflict (agent_id) do nothing
        ), product AS (
          insert into product (id, name)
            select id, name from pl
          on conflict (id) do nothing
        ), sku AS (
          insert into sku (id, product_id)
            select id, product_id from ps
          on conflict (id) do nothing
        ), cartline AS (
          insert into cart_line as c (agent_id, product_id, sku_id, quantity, checked, updated)
          select al.id as agent_id, ps.product_id, ul.id as sku_id, ul.quantity, ul.checked, ul.updated
          from al, ul join ps on(ul.id=ps.id)
          on conflict (agent_id, product_id, sku_id) do
            update set
              quantity = coalesce(c.quantity + excluded.quantity, c.quantity, 0),
              checked  = coalesce(c.checked ~| excluded.checked, excluded.checked, true),
              updated  = now()
          returning sku_id
        ) select array_agg(sku_id) from cartline INTO rv
        ;
        RETURN rv;
END;
$$  LANGUAGE plpgsql