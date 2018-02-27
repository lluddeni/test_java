DROP TABLE IF EXISTS public.feature;
CREATE TABLE public.feature
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  feature character varying(100),
  detected_usage integer,
  total_samples integer,
  first_usage date,
  last_usage date
)
;
