
-- licences acquises par produit et metrique
select Product,Metric,sum(Nb)
 from Licence
 group by Product, Metric
 order by Metric, Product



-- serveurs, licences proc associees et minimas
select servername, servertype, Dbenv,edition,
 Nb_cpu , 
 Nb_core,
  case when L1.edition = 'EE' then cast(Nb_core as integer) /2 
				    when L1.edition = 'SE' then cast(Nb_cpu as integer)
				    when L1.edition = 'XE' then 0 
				    end  Nb_lic_proc,
				    case when L1.edition = 'EE' then (cast(Nb_core as integer) /2)*25 
				    when L1.edition = 'SE' then (cast(Nb_cpu as integer))*5
				    when L1.edition = 'XE' then 0 
				    end  Nb_lic_nup_mini
from
(

select distinct upper(substring(Inventory.Servername from '[^.]*')) servername , Servertype servertype, ESXi_cluster, Dbenv,
 Nb_cpu , 
 Nb_core  ,
( select string_agg(distinct case when R2.Release like '%Enterprise%' then 'EE'  when R2.Release like '%Express%' then 'XE' else 'SE' end, ' , ')  Edition
from public.Release R2 where upper(trim(substring(Inventory.Servername from '[^.]*'))) = upper(trim(substring(R2.Servername from '[^.]*')))
)
from public.Inventory
) L1
order by edition, servername
