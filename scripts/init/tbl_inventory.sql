\c test;

DROP TABLE IF EXISTS public.inventory_user;
CREATE TABLE public.inventory_user
(
  id SERIAL not null primary key,
  name character varying(50),
  role character varying(50),
  email character varying(50) null,
  password character varying(50) null,
  comment character varying(256) null,
  parameters character varying(512) null
);
