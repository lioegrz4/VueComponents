CREATE TABLE agent (
  id       serial primary key,
  name     text,
  contact  jsonb,
  location jsonb,
  ext      jsonb
);
CREATE UNIQUE INDEX idx_agent_name ON agent (name);
CREATE TABLE product (
  id          serial primary key,
  name        text,
  code        text,
  keyword     text,
  description text,
  ext         jsonb
);
CREATE TABLE tag (
  id   serial primary key,
  pid  integer REFERENCES tag(id),
  name text
);
CREATE TABLE tag_product (
  tag_id     integer REFERENCES tag(id),
  product_id integer REFERENCES product(id)
);
CREATE UNIQUE INDEX idx_tag_product_id ON tag_product (tag_id, product_id);
CREATE TABLE sku (
  id         serial primary key,
  product_id integer references product (id),
  unit       text,
  stock      integer,
  moq        integer,
  ext        jsonb,
  updated    timestamp default now()
);
CREATE UNIQUE INDEX idx_sku_id ON sku (id, product_id);
CREATE TABLE cart (
  agent_id integer references agent (id),
  created   timestamp default now(),
  ext       jsonb
);
CREATE UNIQUE INDEX idx_cart_id ON cart (agent_id);
CREATE INDEX idx_cart_created ON cart USING brin (created);

CREATE TABLE cart_line (
  agent_id  integer references agent (id),
  product_id integer references product(id),
  sku_id     integer references sku (id),
  updated    timestamp default now(),
  quantity   integer   default 0,
  checked    boolean   default true
);
CREATE INDEX idx_cart_updated ON cart_line USING brin (updated);
CREATE UNIQUE INDEX idx_cart_line_id on cart_line (agent_id, product_id, sku_id);

CREATE FUNCTION xor(bool, bool) RETURNS bool AS '
SELECT ($1 AND NOT $2) OR (NOT $1 AND $2);
'LANGUAGE 'sql';

CREATE OPERATOR ~| ( PROCEDURE = 'xor', LEFTARG = bool, RIGHTARG = bool );