-- liste bases pour option donnée et serveurs donnés

select distinct "Servername","Dbname", "Pack" 
from public."Feature", public."Feature_pack"
where "Feature"."Feature"= "Feature_pack"."Feature" and "Pack" is not null
--and "Pack" like 'Part%'
and "Servername" in ('edcemeadwhdbp01.edc.lafargeone.net', 'edcp5dbp02.edc.lafargeone.net', 'edcp6dbp03.edc.lafargeone.net')
order by "Pack","Dbname","Servername"
;

-- detail 
select  "Feature"."Servername", "Dbname", "Feature"."Feature", sum("Detected_usage"), sum("Total_samples"), min("First_usage"),max( "Last_usage")
from public."Feature", public."Feature_pack"
where "Feature"."Feature"= "Feature_pack"."Feature" and "Pack" is not null
and "Pack" like 'RAC%'
and "Servername" in ('edcemeadwhdbp01.edc.lafargeone.net', 'edcp5dbp02.edc.lafargeone.net', 'edcp6dbp03.edc.lafargeone.net')
group by "Feature"."Servername", "Dbname", "Feature"."Feature"
order by "Dbname","Servername"

-----------------------------------
-- liste serveurs et options pour un cluster vmware en particulier

select distinct "Feature"."Servername", string_agg(distinct "Pack" , ' , ')
from public."Feature", public."Feature_pack", "Inventory"
where "Feature"."Feature"= "Feature_pack"."Feature" and "Pack" is not null
--and "Pack" like 'Part%'
and upper(trim(substring("Inventory"."Servername" from '[^.]*'))) = upper(trim(substring("Feature"."Servername" from '[^.]*')))
and "ESXi_cluster" like 'P5-ES-Gold-Res-01'
group by "Feature"."Servername"
order by "Feature"."Servername"
;

select distinct "Feature"."Servername", "Feature"."Dbname","Pack"
from public."Feature", public."Feature_pack", "Inventory"
where "Feature"."Feature"= "Feature_pack"."Feature" and "Pack" is not null
--and "Pack" like 'Part%'
and upper(trim(substring("Inventory"."Servername" from '[^.]*'))) = upper(trim(substring("Feature"."Servername" from '[^.]*')))
--and "ESXi_cluster" like 'P5-ES-Gold-Res-01'
order by "Feature"."Servername"
;


-- par cluster et pack
select distinct "ESXi_cluster","Pack"
from public."Feature", public."Feature_pack", "Inventory"
where "Feature"."Feature"= "Feature_pack"."Feature" and "Pack" is not null
--and "Pack" like 'Part%'
and upper(trim(substring("Inventory"."Servername" from '[^.]*'))) = upper(trim(substring("Feature"."Servername" from '[^.]*')))
--and "ESXi_cluster" like 'P5-ES-Gold-Res-01'
and "ESXi_cluster" <> 'NA'
and "Pack" like 'Spa%'
order by "ESXi_cluster"
;








-- detail pour cluster vmware et option en particulier

-- detail 
select "ESXi_cluster", "Feature"."Servername", "Feature"."Dbname", "Pack", "Feature"."Feature", sum("Detected_usage"), sum("Total_samples"), min("First_usage"),max( "Last_usage")
from public."Feature", public."Feature_pack", "Inventory"
where "Feature"."Feature"= "Feature_pack"."Feature" and "Pack" is not null
and upper(trim(substring("Inventory"."Servername" from '[^.]*'))) = upper(trim(substring("Feature"."Servername" from '[^.]*')))
and "ESXi_cluster" <> 'NA'
group by "ESXi_cluster","Feature"."Servername", "Feature"."Dbname", "Pack","Feature"."Feature"
order by "ESXi_cluster","Feature"."Dbname","Servername"


