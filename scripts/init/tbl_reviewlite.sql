
DROP TABLE IF EXISTS public.reviewlite_servers;
CREATE TABLE public.reviewlite_servers
(
  physical_srv_name character varying(250), 
  start_hour integer null,
  sqlplus_port integer null,
  timestamp_try TIMESTAMP null,
  timestamp_result TIMESTAMP null, 
  user_id integer null,
  action character varying(50) null,
  status character varying(50) null
)
;

DROP TABLE IF EXISTS public.reviewlite_databases;
CREATE TABLE public.reviewlite_databases
(
  physical_srv_name character varying(250), 
  db_name character varying(50) null,
  status character varying(50) null
)
;


DROP TABLE IF EXISTS public.reviewlite_history;
CREATE TABLE public.reviewlite_history
(
  id BIGSERIAL not null primary key,
  user_id integer null,
  action character varying(50),
  comment character varying(256),
  timestamp TIMESTAMP default now()

);



