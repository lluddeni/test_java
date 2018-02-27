SET TERMOUT OFF
SET ECHO OFF
SET PAUSE OFF
SET VERIFY OFF
SET HEADING OFF
SET FEEDBACK OFF
SET LINESIZE 500
-- Get host_name and instance_name
prompt Getting HOST_NAME and INSTANCE_NAME ...
define INSTANCE_NAME=UNKNOWN
define HOST_NAME=UNKNOWN
col C1 new_val INSTANCE_NAME
col C2 new_val HOST_NAME
-- Oracle7
SELECT min(machine) C2 FROM v$session WHERE type = 'BACKGROUND';
SELECT name    C1 FROM v$database;
-- Oracle8 and higher
SELECT instance_name C1, host_name C2 FROM v$instance;
-- Oracle12 and higher
  SELECT '&&INSTANCE_NAME' || decode(value, 'TRUE', '~' || replace(sys_context('USERENV', 'CON_NAME'), '$', '_'), '') C1
  from v$parameter where name = 'enable_pluggable_database';

define OUTPUT_PATH=***
col C3 new_val OUTPUT_PATH
select '&&HOST_NAME._&&INSTANCE_NAME._' C3 from DUAL;

-- Get SYSDATE
define SYSDATE_START=UNKNOWN
col C0 new_val SYSDATE_START
select SYSDATE C0 from dual;

	   
SPOOL &&OUTPUT_PATH.heap_compression.csv


PROMPT
PROMPT
PROMPT HeapCompression detection
PROMPT -------------------------------------------

PROMPT

PROMPT OWNER,TABLE_NAME,COMPRESS_FOR,HOST_NAME,INSTANCE_NAME,SYSDATE

SELECT 
'"' || owner       ||'","'||
table_name         ||'","'||
compress_for       ||'","'||
'&&HOST_NAME'      ||'","'||
'&&INSTANCE_NAME'  ||'","'||  
'&&SYSDATE_START'  ||'"' as result
FROM dba_tables 
WHERE compress_for IN('FOR ALL OPERATIONS','OLTP','QUERY LOW','QUERY HIGH','ARCHIVE LOW','ARCHIVE HIGH');

SPOOL OFF

SPOOL &&OUTPUT_PATH.datapump_compression.csv


PROMPT
PROMPT
PROMPT Datapump compression detection
PROMPT -------------------------------------------

PROMPT

PROMPT FEATURE_INFO,DETECTED_USAGES,FIRST_USAGE_DATE,LAST_USAGE_DATE,HOST_NAME,INSTANCE_NAME,SYSDATE_START

SELECT 
'"' || FEATURE_INFO    ||'","'||
DETECTED_USAGES       ||'","'||
FIRST_USAGE_DATE      ||'","'||
LAST_USAGE_DATE       ||'","'||
'&&HOST_NAME'      ||'","'||
'&&INSTANCE_NAME'  ||'","'||  
'&&SYSDATE_START'  ||'"' as result
FROM DBA_FEATURE_USAGE_STATISTICS 
WHERE  detected_usages > 0 
and name like '%Datapump%' 
and (regexp_like(lower(to_char(feature_info)), '*compression used: [1-9]* times*') or regexp_like(lower(to_char(feature_info)), 'compression used: *true'));

SPOOL OFF

EXIT