DROP TABLE IF EXISTS hwm_sessions;
CREATE TABLE hwm_sessions
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  max_sessions integer
)
;
