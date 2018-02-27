SELECT * FROM (
SELECT DISTINCT f.virtual_srv_name       AS "Virtual server name"
     , f.db_name                AS "Database name"
     , CASE WHEN f.feature = 'HeapCompression' THEN '?'
            ELSE p.pack
       END
     , f.feature                AS "Feature used"
     , SUM(detected_usage) OVER (PARTITION BY f.virtual_srv_name, f.db_name, p.pack, f.feature)
     , MIN(TO_CHAR(first_usage, 'DD/MM/YYYY')) OVER (PARTITION BY f.virtual_srv_name, f.db_name, p.pack, f.feature) AS "First usage"
     , MAX(TO_CHAR(last_usage, 'DD/MM/YYYY')) OVER (PARTITION BY f.virtual_srv_name, f.db_name, p.pack, f.feature) AS "Last usage"
     , DATE_PART('day', NOW() - max(last_usage) OVER (PARTITION BY f.virtual_srv_name, f.db_name, p.pack, f.feature)) AS "Last usage days ago"
     , COUNT(ps.segment_name) OVER (PARTITION BY f.virtual_srv_name, f.db_name, ps.server_name, ps.db_name)
FROM feature f
JOIN feature_pack p
  ON f.feature = p.feature
 AND p.pack is not null
LEFT JOIN part_segments ps
       ON ps.server_name = f.virtual_srv_name
      AND ps.db_name = f.db_name
--WHERE DATE_PART('day', NOW() - last_usage) >= 700
) t
ORDER BY 1, 2, 3, 4
;