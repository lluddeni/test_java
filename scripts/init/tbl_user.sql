DROP TABLE IF EXISTS public.inventory_user;
CREATE TABLE public.inventory_user
(
  id SERIAL not null primary key,
  name character varying(50),
  role character varying(50),
  email character varying(50) null,
  password character varying(50) null,
  comment character varying(256) null
);

insert into public.inventory_user (name,role) values ('superadmin','superadmin');
insert into public.inventory_user (name,role,password) values ('anonymous','user','');

