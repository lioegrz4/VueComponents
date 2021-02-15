CREATE OR REPLACE FUNCTION {{func_name}}(INTEGER)
RETURNS JSON AS $$
DECLARE rv record;
BEGIN
        WITH items AS (
            select
              agent_id,
              max(updated) as updated,
              json_agg(json_build_object(
                           'id', sku_id,
                           'quantity', quantity,
                           'checked', checked
                       ))  as items
            from cart_line
            where agent_id = $1
            group by agent_id, updated
            order by agent_id, updated desc
        ) select
            items.agent_id, created, updated, items, ext
          from items join cart on cart.agent_id = items.agent_id
          into rv
        ;

        RETURN row_to_json(rv);
END;
$$  LANGUAGE plpgsql