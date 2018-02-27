\echo
\echo Flush tables
\echo ==============
truncate table licence;
truncate table Inventory_Databases;
truncate table Inventory_Servers;
truncate table inventory_servers_licences;

\echo
\echo Import
\echo ==============

\echo Import fichier inventory databases
\set quoted_chemin_inventory_db '\'' :chemin '/inventory_databases.csv' '\''
\copy Inventory_Databases from :quoted_chemin_inventory_db WITH DELIMITER ';' CSV ;

\echo Import fichier inventory servers
\set quoted_chemin_inventory_servers '\'' :chemin '/inventory_servers.csv' '\''
\copy Inventory_Servers from :quoted_chemin_inventory_servers WITH DELIMITER ';' CSV ;

\echo Import fichier licences
\set quoted_chemin_licences '\'' :chemin '/licence.csv' '\''
\copy licence from :quoted_chemin_licences WITH DELIMITER ';' CSV ;

\echo Import fichier Servers licences
\set quoted_chemin_inventory_servers_licences '\'' :chemin '/inventory_servers_licences.csv' '\''
\copy inventory_servers_licences from :quoted_chemin_inventory_servers_licences WITH DELIMITER ';' CSV ;

