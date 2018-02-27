DROP TABLE IF EXISTS public.cpu_max;
CREATE TABLE public.cpu_max
(
  server_name character varying(250),
  db_name character varying(50),
  date_snap date,
  Numcore integer,
  Numsocket integer
)
;
