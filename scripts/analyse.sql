\pset pager off
\set QUIET on
\x off

\set mode aligned

\pset format :mode

\echo
\echo Serveurs physiques
\echo ====================================================================
SELECT '==========';--necessaire car le 1er select ne s'affiche pas!!!
SELECT  vcenter  AS "vCenter"
	 , vcluster      AS "Cluster VMware"     
     , vsphere_version     AS "vSphere version"  
     , physical_srv_name AS "Physical server name"
     , cpu_model         AS "CPU model"     
     , nb_cpu             AS "#cpu"   
     , nb_core_by_cpu    AS "#core / cpu"  
     , nb_core            AS "#core"   
     , core_factor  AS "Core factor"
	, CASE WHEN nb_cpu <= 2
                THEN 'All editions'
            WHEN nb_cpu <= 4 THEN 'EE and SE only (not SE1 nor SE2)'
            ELSE 'EE only'
       END AS "Edition eligibility"         	 
	 FROM public.inventory_servers 
	 ORDER BY vcenter
       , vcluster
       , physical_srv_name;

\echo Détail des éditions et versions de bases de données
\echo ====================================================================
SELECT d.virtual_srv_name       AS "Virtual server name"
     , d.db_name                AS "Database name"
     --, release                AS "Release"
     , CASE WHEN release is null then 'Unknown - check data consistency'
	    WHEN release LIKE '%Enterprise%' THEN 'Enterprise'  
            WHEN release LIKE '%Express%'    THEN 'Express' 
            ELSE 'Standard'
       END AS "Edition"
     , SUBSTRING(release FROM '\d+\.\d\.\d\.\d') AS "Version"
     , physical_srv_name        AS "Physical server name"
FROM public.inventory_databases d
LEFT JOIN public.release r
       ON  trim(upper(substring(d.virtual_srv_name from '[^.]*'))) = trim(upper(substring(r.virtual_srv_name from '[^.]*')))
       AND trim(upper(d.db_name)) = trim(upper(r.db_name))
ORDER BY physical_srv_name ,d.db_name;

\echo Licences nécessaires
\echo ====================================================================
SELECT vcenter                                                      AS "vCenter"
     , vcluster                                                     AS "Cluster VMware"
     , s.physical_srv_name                                          AS "Physical server name"
     , nb_cpu                                                       AS "#cpu"
     , nb_core                                                      AS "#core"
     , core_factor                                                  AS "Core factor"
     , CASE WHEN nb_cpu <= 2
                THEN 'All editions'
            WHEN nb_cpu <= 4 THEN 'EE and SE only (not SE1 nor SE2)'
            ELSE 'EE only'
       END                                                          AS "Edition eligibility"
     , CASE WHEN nb_cpu <=4 THEN ''||nb_cpu
            ELSE 'N/A'
       END                                                          AS "# lic proc SE"
     , CASE WHEN nb_cpu <=4 THEN ''||5
            ELSE 'N/A'
       END                                                          AS "min NUP SE/SE1"
     , CASE WHEN nb_cpu <=2 THEN ''||10
            ELSE 'N/A'
       END                                                          AS "min NUP SE2"
     , nb_core * core_factor                                        AS "# lic proc EE"
     , ROUND(nb_core * core_factor * 25)                            AS "min NUP EE"
     , string_agg(DISTINCT
            CASE WHEN release LIKE '%Enterprise%' THEN 'EE'  
                 WHEN release LIKE '%Express%'    THEN 'XE' 
                 WHEN release IS NULL THEN '?'
                 ELSE 'SE'
            END, ', ')                                              AS "Editions found"
FROM public.inventory_servers s 
LEFT JOIN public.inventory_databases d
       ON d.physical_srv_name = s.physical_srv_name
LEFT JOIN public.release r
       ON  trim(upper(substring(d.virtual_srv_name from '[^.]*'))) = trim(upper(substring(r.virtual_srv_name from '[^.]*')))
       AND trim(upper(d.db_name)) = trim(upper(r.db_name))
GROUP BY vcenter
       , vcluster
       , s.physical_srv_name
       , nb_core
       , core_factor
ORDER BY vcenter
       , vcluster
       , s.physical_srv_name
;

\echo Contrôles des packs de management
\echo ====================================================================
SELECT virtual_srv_name                   AS "Virtual server name"
     , db_name                            AS "Database name"
     , value                              AS "Control management pack access"
FROM public.parameters 
WHERE name = 'control_management_pack_access'
ORDER BY virtual_srv_name,
	db_name
;

--\echo Fonctionnalités soumises à licence utilisées dans les 700 derniers jours
--\echo ========================================================================
--SELECT f.virtual_srv_name       AS "Virtual server name"
--     , f.db_name                AS "Database name"
--     , p.pack                   AS "Pack"
--     , f.feature                AS "Feature used"
--     , sum(detected_usage)
--     , min(TO_CHAR(first_usage, 'DD/MM/YYYY') ) AS "First usage"
--     , max(TO_CHAR(last_usage, 'DD/MM/YYYY')) AS "Last usage"
--     , DATE_PART('day', NOW() - max(last_usage)) AS "Last usage days ago"
--     
--FROM feature f
--JOIN feature_pack p
--  ON f.feature = p.feature
-- AND p.pack is not null
--WHERE DATE_PART('day', NOW() - last_usage) < 700
--GROUP BY  f.virtual_srv_name       
--     , f.db_name               
--     , p.pack                   
--     , f.feature	
--ORDER BY  f.virtual_srv_name,
--	f.db_name
--	, p.pack
--	, f.feature
--;

\echo Fonctionnalités soumises à licence --utilisées il y a plus de 700 jours
\echo ========================================================================
SELECT f.virtual_srv_name       AS "Virtual server name"
     , f.db_name                AS "Database name"
     , p.pack
     , f.feature                AS "Feature used"
     , SUM(detected_usage)
     , MIN(TO_CHAR(first_usage, 'DD/MM/YYYY') ) AS "First usage"
     , MAX(TO_CHAR(last_usage, 'DD/MM/YYYY')) AS "Last usage"
     , DATE_PART('day', NOW() - max(last_usage)) AS "Last usage days ago"
FROM public.feature f
JOIN public.feature_pack p
  ON f.feature = p.feature
 AND p.pack is not null
--WHERE DATE_PART('day', NOW() - last_usage) >= 700
GROUP BY f.virtual_srv_name       
       , f.db_name               
       , p.pack                   
       , f.feature	
ORDER BY f.virtual_srv_name
        , f.db_name
	    , p.pack
	    , f.feature
;

\echo Synthèse des options soumises à licence utilisées
\echo ====================================================================
SELECT f.virtual_srv_name                   AS "Virtual server name"
     , f.db_name                            AS "Database name"
     , string_agg(distinct(p.pack), ', ')   AS "Pack(s)"
FROM public.feature f
JOIN public.feature_pack p
  ON f.feature = p.feature
 AND p.pack IS NOT NULL
GROUP BY f.db_name
       , f.virtual_srv_name
ORDER BY f.db_name
       , f.virtual_srv_name
;

\echo Récapitulatif des serveurs physiques avec des options utilisés
\echo ====================================================================
SELECT DISTINCT i.physical_srv_name AS "Physical server name"
              , string_agg(distinct(p.pack), ', ')   AS "Pack(s)"
FROM public.feature f
JOIN public.feature_pack p
 ON f.feature = p.feature
AND p.pack is not null
LEFT JOIN public.inventory_databases i
 ON  trim(upper(substring(i.virtual_srv_name from '[^.]*'))) = trim(upper(substring(f.virtual_srv_name from '[^.]*')))
AND trim(upper(i.db_name)) = trim(upper(f.db_name))
GROUP BY i.physical_srv_name
ORDER BY 1
;

\t on
\pset format unaligned
\o crosstab.sql

SELECT $s$
SELECT * FROM CROSSTAB($$
                       SELECT DISTINCT f.db_name || ' @ ' || f.virtual_srv_name AS db
                            , f.db_name
                            , f.virtual_srv_name
                            , i.physical_srv_name
                            , p.pack
                            , 'X'
                       FROM public.feature f
                       JOIN public.feature_pack p
                         ON f.feature = p.feature
                        AND p.pack is not null
                       LEFT JOIN public.inventory_databases i
                         ON  trim(upper(substring(i.virtual_srv_name from '[^.]*'))) = trim(upper(substring(f.virtual_srv_name from '[^.]*')))
                        AND trim(upper(i.db_name)) = trim(upper(f.db_name))
                       ORDER BY 1, 2
                       $$
                     , $$
                       SELECT DISTINCT pack
                       FROM public.feature_pack p
                       WHERE EXISTS (SELECT 1
                                     FROM public.feature f
                                     WHERE f.feature = p.feature AND p.pack is not null)
                       ORDER BY pack
                       $$
) AS ct("Entity" varchar(255)
      , "Database name" varchar(255)
      , "Virtual server name" varchar(255)
      , "Physical server name" varchar(255)
$s$
;

SELECT DISTINCT '      , "' || pack || '" VARCHAR(255)' AS pack
FROM public.feature_pack p
WHERE EXISTS (SELECT 1
             FROM public.feature f
             WHERE f.feature = p.feature AND p.pack is not null)
ORDER BY pack
;

SELECT $s$
);
$s$
;

\o
\t off

\pset format :mode

\i crosstab.sql

\t on
\pset format unaligned
\o crosstab.sql

SELECT $s$
SELECT * FROM CROSSTAB($$
                       SELECT DISTINCT i.physical_srv_name AS "Physical server name"
                            , p.pack
                            , 'X'
                       FROM public.inventory_servers s
                       LEFT JOIN public.inventory_databases i
                         ON  trim(upper(substring(i.physical_srv_name from '[^.]*'))) = trim(upper(substring(s.physical_srv_name from '[^.]*')))
                       LEFT JOIN public.feature f
                         ON  trim(upper(substring(i.virtual_srv_name from '[^.]*'))) = trim(upper(substring(f.virtual_srv_name from '[^.]*')))
                        AND trim(upper(i.db_name)) = trim(upper(f.db_name))
                       LEFT JOIN public.feature_pack p
                         ON f.feature = p.feature
                        AND p.pack is not null

                       ORDER BY 1, 2
                       $$
                     , $$
                       SELECT DISTINCT pack
                       FROM public.feature_pack p
                       WHERE EXISTS (SELECT 1
                                     FROM public.feature f
                                     WHERE f.feature = p.feature AND p.pack is not null)
                       ORDER BY pack
                       $$
) AS ct("Physical server name" varchar(255)
$s$
;

SELECT DISTINCT '      , "' || pack || '" VARCHAR(255)' AS pack
FROM public.feature_pack p
WHERE EXISTS (SELECT 1
             FROM public.feature f
             WHERE f.feature = p.feature AND p.pack is not null)
ORDER BY pack
;

SELECT $s$
);
$s$
;

\o
\t off

\pset format :mode

\i crosstab.sql
