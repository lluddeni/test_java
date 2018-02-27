\echo Bases présentes dans l'\''inventaire et pas dans le fichier Release :
\echo ====================================================================
select db_name
     , virtual_srv_name
from Inventory_Databases i
where not exists (
    select 1
    from Release r
    where trim(upper(r.db_name)) = trim(upper(i.db_name))
)
order by db_name
;

\echo Bases présentes dans le fichier Release et pas dans l'\''inventaire :
\echo ====================================================================
select db_name
     , virtual_srv_name
from Release r
where not exists (
    select 1
    from Inventory_Databases i
    where trim(upper(i.db_name)) = trim(upper(r.db_name))
)
order by db_name
;

\echo Serveurs présents dans l'\''inventaire et pas dans le fichier Release
\echo ====================================================================
select db_name
     , virtual_srv_name
from Inventory_Databases i
where not exists (
    select 1
    from Release r
    where trim(upper(substring(r.virtual_srv_name from '[^.]*'))) = trim(upper(substring(i.virtual_srv_name from '[^.]*')))
)
order by db_name
;

\echo Serveurs présents dans le fichier Release et pas dans l'\''inventaire
\echo ====================================================================
select db_name
     , virtual_srv_name
from Release r
where not exists (
    select 1
    from Inventory_Databases i
    where trim(upper(substring(i.virtual_srv_name from '[^.]*'))) = trim(upper(substring(r.virtual_srv_name from '[^.]*')))
)
order by db_name
;

\echo Bases pas sur le meme serveur
\echo ====================================================================
select 'Inventory' AS source
     , trim(upper(i.db_name)) AS db_name
     , trim(upper(substring(i.virtual_srv_name from '[^.]*'))) AS srv_name
from Inventory_Databases i
where exists (
    select 1
    from release r
    where trim(upper(r.db_name)) = trim(upper(i.db_name))
      and trim(upper(substring(r.virtual_srv_name from '[^.]*'))) <> trim(upper(substring(i.virtual_srv_name from '[^.]*')))
)
union
select 'Release' AS source
     , trim(upper(r.db_name))
     , trim(upper(substring(r.virtual_srv_name from '[^.]*')))
from release r
where exists (
    select 1
    from Inventory_Databases i
    where trim(upper(i.db_name)) = trim(upper(r.db_name))
      and trim(upper(substring(i.virtual_srv_name from '[^.]*'))) <> trim(upper(substring(r.virtual_srv_name from '[^.]*')))
)
ORDER BY db_name
       , source
       , srv_name
;

\echo Bases avec des versions différentes à celles de l'\''inventaire
\echo ====================================================================
SELECT *
FROM (
    SELECT r.virtual_srv_name
         , r.db_name
         --, release
         , CASE WHEN release LIKE '%Enterprise%' THEN 'Enterprise'  
                WHEN release LIKE '%Express%'    THEN 'Express' 
                ELSE 'Standard'
           END AS edition
         , SUBSTRING(release FROM '\d+\.\d\.\d\.\d') AS version
         , i.db_edition AS inv_edition
         , i.db_version AS inv_version
    FROM release r
    FULL JOIN  inventory_databases i 
           ON  trim(upper(substring(i.virtual_srv_name from '[^.]*'))) = trim(upper(substring(r.virtual_srv_name from '[^.]*')))
           AND trim(upper(i.db_name)) = trim(upper(r.db_name))
) t
WHERE edition <> inv_edition
   OR version <> inv_version
ORDER BY db_name
;

\echo Nouvelle feature à ajouter dans Feature_pack
\echo ====================================================================
select f.feature
     , count(*)
from Feature f
where not exists (
    select 1 
    from Feature_pack p
    where p.feature = f.feature
)
group by f.feature
order by f.feature;

