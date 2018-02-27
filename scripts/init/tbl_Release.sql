DROP TABLE IF EXISTS public.release;
CREATE TABLE public.release
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  release character varying(80),
  CONSTRAINT PK_Release PRIMARY KEY (virtual_srv_name, db_name)
)
;