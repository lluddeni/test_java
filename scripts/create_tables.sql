
DROP TABLE IF EXISTS public.inventory_history;
CREATE TABLE public.inventory_history
(

  id BIGSERIAL not null primary key,
  user_id integer null,
  action character varying(51) null ,
  comment character varying(256) null,
  timestamp TIMESTAMP default now()

);


DROP TABLE IF EXISTS public.inventory_Databases;
CREATE TABLE public.inventory_Databases
(
  physical_srv_name character varying(250),
  virtual_srv_name character varying(250) null,
  is_physical boolean null,
  db_name character varying(50) null,
  db_version character varying(80) null,
  db_edition character varying(80) null,
  db_env character varying(30) null,
  OS character varying(50) null
)
;

ALTER TABLE ONLY public.inventory_Databases ADD CONSTRAINT PK_inventory_Databases PRIMARY KEY (physical_srv_name, db_name);

DROP TABLE IF EXISTS public.inventory_Servers;
CREATE TABLE public.inventory_Servers
(
  vCenter character varying(250) null,
  vCluster character varying(250) null,
  vSphere_version character varying(20) null,
  physical_srv_name character varying(250),
  CPU_model character varying(50) null,
  nb_cpu decimal null,
  nb_core_by_cpu decimal null,
  nb_core decimal null,
  nb_logical_core decimal null,
  core_factor decimal null
)
;

ALTER TABLE ONLY public.inventory_Servers ADD CONSTRAINT PK_inventory_Servers PRIMARY KEY (physical_srv_name);

DROP TABLE IF EXISTS public.inventory_servers_licences;
CREATE TABLE public.inventory_servers_licences
(
  CSI character varying(20),
  Product character varying(70),
  physical_srv_name character varying(250),
  Metric character varying(50),
  Nb integer
)
;
ALTER TABLE ONLY public.inventory_servers_licences ADD CONSTRAINT PK_inventory_servers_licences PRIMARY KEY (CSI,Product,physical_srv_name);


DROP TABLE IF EXISTS public.Licence;
CREATE TABLE public.Licence
(
  CSI character varying(20),
  Product character varying(70),
  Metric character varying(50),
  Nb integer,
  Used integer
)
;
ALTER TABLE ONLY public.Licence ADD CONSTRAINT PK_inventory_Licence PRIMARY KEY (CSI,Product);


DROP TABLE IF EXISTS public.inventory_user;
CREATE TABLE public.inventory_user
(
  id SERIAL not null primary key,
  name character varying(50),
  role character varying(50),
  email character varying(50) null,
  password character varying(50) null,
  comment character varying(256) null,
  parameters character varying(512) null
);


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


DROP TABLE IF EXISTS public.audit_history;
CREATE TABLE public.audit_history
(
  id BIGSERIAL not null primary key,
  user_id integer null,
  status character varying(256) null,
  comment character varying(256) null,
  timestamp TIMESTAMP default now(),
  lastcheck TIMESTAMP default now()
);


DROP TABLE IF EXISTS public.cpu_max;
CREATE TABLE public.cpu_max
(
  server_name character varying(250),
  db_name character varying(50),
  date_snap date,
  Numcpu integer null,
  Numcore integer null,
  Numsocket integer null
)
;

DROP TABLE IF EXISTS public.Feature_pack;
CREATE TABLE public.Feature_pack 
(
    feature character varying(100) NOT NULL,
    pack character varying(75)
);

insert into public.Feature_pack (Feature, Pack) values
('Partitioning (system)',null),
('EM Configuration', null),
('EM Notification',null),
('SecureFiles (user)',null),
('EM Grid Control',null),
('Data Guard',null),
('EM Management Connectors',null),
('SecureFiles (system)',null),
('SQL Tuning Set (system)',null),
('Automatic Maintenance','SQL Tuning Advisor'),
('EM Report',null),
('Active Data Guard - Real-Time Query on Physical Standby','Active Data Guard'),
('ADDM','Diagnostic Pack'),
('Advanced Index Compression','Advanced Compression'),
('Automatic Database Diagnostic Monitor','Diagnostic Pack'),
('Automatic Workload Repository','Diagnostic Pack'),
('AWR Report','Diagnostic Pack'),
('EM AS Provisioning and Patch Automation Pack','WebLogic Server Management Pack Enterprise Edition'),
('EM Config Management Pack','Configuration Management Pack for Oracle Database'),
('EM Database Provisioning and Patch Automation Pack','Provisioning and Patch Automation Pack for Database'),
('EM Performance Page','Diagnostic Pack'),
('EM Standalone Provisioning and Patch Automation Pack','Provisioning and Patch Automation Pack'),
('Partitioning (user)','Partitioning'),
('Real Application Clusters (RAC)','RAC'),
('Real-Time SQL Monitoring','Tuning Pack'),
('SQL Access Advisor','Tuning Pack'),
('SQL Monitoring and Tuning pages','Tuning Pack'),
('SQL Profile','Tuning Pack'),
('SQL Tuning Advisor','Tuning Pack'),
('Spatial','Spatial or Locator'),
('Global Data Services',null),
('ADVANCED Index Compression','Advanced Compression'),
('Automatic SQL Tuning Advisor','Tuning Pack'),
('AWR Baseline','Diagnostic Pack'),
('AWR Baseline Template','Diagnostic Pack'),
('Backup Encryption','Advanced Security'),
('Backup HIGH Compression','Advanced Compression'),
('Backup LOW Compression','Advanced Compression'),
('Backup MEDIUM Compression','Advanced Compression'),
('Backup ZLIB Compression','Advanced Compression'),
('Backup BZIP2 Compression',null),
('Baseline Adaptive Thresholds','Diagnostic Pack'),
('Baseline Static Computations','Diagnostic Pack'),
('Change Management Pack','Change Management Pack'),
('Database Replay: Workload Capture','Real Application Testing'),
('Database Replay: Workload Replay','Real Application Testing'),
('Data Masking Pack','Data Masking Pack'),
('Data Mining','Advanced Analytics'),
('Diagnostic Pack','Diagnostic Pack'),
('Encrypted Tablespaces','Advanced Security'),
('Exadata','.Exadata'),
('Flashback Data Archive','Advanced Compression'),
('Gateways','.Database Gateway'),
('GoldenGate','.GoldenGate'),
('HeapCompression','Advanced Compression ? (further information needed)'),
('Oracle Utility Datapump (Export)','Advanced Compression ? (further information needed)'),
('Heat Map','Advanced Compression'),
('Hybrid Columnar Compression','.HW'),
('Hybrid Columnar Compression Row Level Locking','.HW'),
('Information Lifecycle Management','Advanced Compression'),
('In-Memory Aggregation	Database','In-Memory'),
('In-Memory Column Store','Database In-Memory'),
('Label Security','Label Security'),
('OLAP - Analytic Workspaces','OLAP'),
('OLAP - Cubes','OLAP'),
('Oracle Advanced Network Compression Service','Advanced Compression'),
('Oracle Database Vault','Database Vault'),
('Oracle Multitenant','Multitenant'),
('Oracle Secure Backup','.Secure Backup'),
('Pillar Storage','.Pillar Storage'),
('Pillar Storage with EHCC','.Pillar Storage'),
('Privilege Capture','Database Vault'),
('Quality of Service Management','RAC or RAC One Node'),
('Real Application Cluster One Node','Real Application Clusters One Node'),
('SecureFile Compression (user)','Advanced Compression'),
('SecureFile Deduplication (user)','Advanced Compression'),
('SecureFile Encryption (user)','Advanced Security'),
('SQL Performance Analyzer','Real Application Testing'),
('SQL Tuning Set (user)','Tuning Pack'),
('Sun ZFS with EHCC','.HW'),
('Transparent Data Encryption','Advanced Security'),
('Transparent Gateway','.Database Gateway'),
('Tuning Pack','Tuning Pack'),
('ZFS Storage','.HW'),
('Oracle Utility Datapump (Import)','Advanced Compression ? (further information needed)'),
('EM Database Control',null),
('Backup BASIC Compression',null),
('Automatic Maintenance - SQL Tuning Advisor',null),
('SQL Tuning Set','Tuning Pack'),
('EM Express',null)
;

ALTER TABLE ONLY public.feature_pack ADD CONSTRAINT PK_Feature_pack PRIMARY KEY (feature);

DROP TABLE IF EXISTS public.feature;
CREATE TABLE public.feature
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  feature character varying(100),
  detected_usage integer,
  total_samples integer,
  first_usage date,
  last_usage date
)
;

DROP TABLE IF EXISTS public.heap_compression;
CREATE TABLE public.heap_compression
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  owner character varying(100),
  table_name character varying(100),
  compress_for character varying(100)

)
;

DROP TABLE IF EXISTS public.datapump_compression;
CREATE TABLE public.datapump_compression
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  feature_info character varying(100),
  detected_usage integer,
  first_usage date,
  last_usage date
)
;

DROP TABLE IF EXISTS public.hwm_sessions;
CREATE TABLE public.hwm_sessions
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  max_sessions integer
)
;

DROP TABLE IF EXISTS public.part_segments;
CREATE TABLE public.part_segments
(
  num integer,
  schema_name character varying(250),
  segment_type character varying(250),
  segment_name character varying(250),
  nb_part integer,
  first_part character varying(250),
  last_part character varying(250),
  server_name character varying(250),
  db_name character varying(50),
  date_test date,
  fin character varying(50)
)
;

DROP TABLE IF EXISTS public.release;
CREATE TABLE public.release
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  release character varying(80),
  CONSTRAINT PK_Release PRIMARY KEY (virtual_srv_name, db_name)
)
;
DROP TABLE IF EXISTS public.spatial_segments;
CREATE TABLE public.spatial_segments
(
  server_name character varying(250),
  db_name character varying(50),
  schema_name character varying(250),
  segment_name character varying(250)
)
;
DROP TABLE IF EXISTS public.parameters;
CREATE TABLE public.parameters
(
  virtual_srv_name character varying(250),
  db_name character varying(50),
  name character varying(100),
  value character varying(100)
)
;
drop view if exists public.alert;
DROP TABLE IF EXISTS public.audit_alert CASCADE;
CREATE TABLE public.audit_alert
(	
	audit_id   BIGINT ,
	gravity integer null,
	keys character varying(256) null,	
	board character varying(256),
	target character varying(256) ,
	current_value character varying(256) null,
	expected_value character varying(256) null,
	comment character varying(256) null,
	timestamp TIMESTAMP default now(),
	acktime TIMESTAMP null,
	ackuser integer null,
	id BIGSERIAL not null,
    CONSTRAINT PK_Audit_alert PRIMARY KEY (audit_id, board,keys,target)
);


DROP TABLE IF EXISTS public.servers_licences_need; 
CREATE TABLE public.servers_licences_need
(
  physical_srv_name character varying(250), 
  edition_need character varying(250), 
  edition_found character varying(250),
  LicenceNUP integer null,
  LicenceProc integer null,   
  ActiveDataGuardNUP integer null,
  ActiveDataGuardProc integer null,    
  AdvancedCompressionNUP integer null,
  AdvancedCompressionProc integer null,
  DiagnosticPackNUP integer null,
  DiagnosticPackProc integer null,
  PartitioningNUP integer null,
  PartitioningProc integer null,
  TuningPackNUP integer null,
  TuningPackProc integer null   
);
ALTER TABLE ONLY public.servers_licences_need ADD CONSTRAINT PK_servers_licences_need PRIMARY KEY (physical_srv_name);


CREATE VIEW public.alert AS 
SELECT keys,board,target,current_value,expected_value,comment,timestamp
from public.audit_alert where ackuser is null;


