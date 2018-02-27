DROP TABLE IF EXISTS public.parameters;
CREATE TABLE public.parameters
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  name character varying(100),
  value character varying(100)
)
;
