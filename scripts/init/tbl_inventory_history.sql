DROP TABLE IF EXISTS public.inventory_history;
CREATE TABLE public.inventory_history
(
  id BIGSERIAL not null primary key,
  user_id integer null,
  action character varying(50) null ,
  comment character varying(256) null,
  timestamp TIMESTAMP default now()

);
