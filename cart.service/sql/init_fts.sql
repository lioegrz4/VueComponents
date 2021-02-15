-- CREATE EXTENSION rum;

-- CREATE EXTENSION pg_jieba;
CREATE TEXT SEARCH CONFIGURATION jiebacfg (PARSER = jieba);
CREATE TEXT SEARCH CONFIGURATION jiebaqry (PARSER = jiebaqry);

ALTER TABLE product ADD COLUMN tsv tsvector;
CREATE INDEX rumidx_product_tsv ON product USING rum(tsv rum_tsvector_ops);


CREATE OR REPLACE FUNCTION product_tsv_trigger() RETURNS trigger AS $$
begin
  new.tsv :=
     setweight(to_tsvector('jiebacfg', coalesce(new.name,'')), 'A') ||
     setweight(to_tsvector('jiebacfg', coalesce(new.keyword,'')), 'A') ||
     setweight(to_tsvector('jiebacfg', coalesce(new.description,'')), 'b');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_tsv_update BEFORE INSERT OR UPDATE
    ON product FOR EACH ROW EXECUTE PROCEDURE product_tsv_trigger();


/*
with ts as (
  select to_tsquery('jiebacfg', 'hello') as q
) select
    ts_headline('jiebacfg', name, ts.q, 'StartSel = {{, StopSel = }}') ,
    description, tsv
from ts, product where tsv @@ ts.q
order by tsv <=> ts.q
--limit 100
;
*/
