DROP TABLE IF EXISTS public.part_segments;
CREATE TABLE public.part_segments
(
  num integer,
  schema_name character varying(250),
  segment_type character varying(250),
  segment_name character varying(250),
  nb_part integer,
  first_part character varying(250),
  last_part character varying(250),
  server_name character varying(250),
  db_name character varying(50),
  date_test date,
  fin character varying(50)
)
;
