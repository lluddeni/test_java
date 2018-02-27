\echo
\echo Flush tables
\echo ==============
truncate table public.Release;
truncate table public.Feature;
truncate table public.Parameters;
truncate table public.hwm_sessions;
truncate table public.part_segments;
truncate table public.spatial_segments;
truncate table public.cpu_max;
truncate table public.heap_compression;
truncate table public.datapump_compression;

\echo
\echo Import
\echo ==============


\echo Import fichier Release
\set quoted_chemin_release '\'' :chemin '/audit_release.txt' '\''
copy public.Release from :quoted_chemin_release  WITH DELIMITER '|' CSV HEADER ;


\echo Import fichier Feature
\set quoted_chemin_feature '\'' :chemin '/audit_feature.txt' '\''
copy public.Feature from :quoted_chemin_feature WITH DELIMITER '|' CSV HEADER ;

\echo Import fichier parameters
\set quoted_chemin_parameters '\'' :chemin '/audit_control_mgmt.txt' '\''
copy public.Parameters from :quoted_chemin_parameters WITH DELIMITER '|' CSV HEADER ;

\echo Import fichier hwm_sessions
\set quoted_chemin_hwm_sessions '\'' :chemin '/audit_hwm_sessions.txt' '\''
copy public.hwm_sessions from :quoted_chemin_hwm_sessions WITH DELIMITER '|' CSV HEADER ;

\echo Import fichier partitioning
\set quoted_chemin_part '\'' :chemin '/audit_part.txt' '\''
copy public.part_segments from :quoted_chemin_part WITH DELIMITER ',' CSV HEADER ;

\echo Import fichier spatial
\set quoted_chemin_spatial '\'' :chemin '/audit_spatial.txt' '\''
copy public.spatial_segments from :quoted_chemin_spatial WITH DELIMITER ',' CSV HEADER ;

\echo Import fichier cpu_max
\set quoted_chemin_cpu_max '\'' :chemin '/audit_cpu_max.txt' '\''
copy public.cpu_max from :quoted_chemin_cpu_max WITH DELIMITER ',' CSV HEADER ;

\echo Import fichier heap_compression
\set quoted_chemin_heap_compression '\'' :chemin '/audit_heap_compression.txt' '\''
copy public.heap_compression from :quoted_chemin_heap_compression WITH DELIMITER '|' CSV HEADER ;

\echo Import fichier datapump_compression
\set quoted_chemin_data_compression '\'' :chemin '/audit_datapump_compression.txt' '\''
copy public.datapump_compression from :quoted_chemin_data_compression WITH DELIMITER '|' CSV HEADER ;



