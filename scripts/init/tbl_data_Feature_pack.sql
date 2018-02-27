DROP TABLE IF EXISTS public.Feature_pack;
CREATE TABLE public.Feature_pack (
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