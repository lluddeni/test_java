SET TERMOUT OFF
SET ECHO OFF
SET PAUSE OFF
SET VERIFY OFF
SET HEADING OFF
SET FEEDBACK OFF
SET LINESIZE 500
SET TAB OFF
SET TRIMOUT ON
SET TRIMSPOOL ON
SET PAGESIZE 5000
SET SERVEROUTPUT ON
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
select '&&HOST_NAME._&&INSTANCE_NAME.' C3 from DUAL;

-- Get SYSDATE
define SYSDATE_START=UNKNOWN
col C0 new_val SYSDATE_START
select SYSDATE C0 from dual;

HOST mkdir &&OUTPUT_PATH

-- Establish separator character for output path
define PATH_SEPARATOR=*
col PATH_SEPARATOR new_val PATH_SEPARATOR
select decode(instr('&&OUTPUT_PATH', '/'), 0,
       decode(instr('&&OUTPUT_PATH', '\'), 0, '/', '\'), '/') as PATH_SEPARATOR
from dual;
-- If case, append separator at the end of otput path
col OUTPUT_PATH new_val OUTPUT_PATH
select decode(instr('&&OUTPUT_PATH', '&&PATH_SEPARATOR', -1),
              length('&&OUTPUT_PATH'), '&&OUTPUT_PATH', '&&OUTPUT_PATH&&PATH_SEPARATOR&&OUTPUT_PATH._') OUTPUT_PATH
from dual;
	   
SPOOL &&OUTPUT_PATH.heap_compression.csv


PROMPT
PROMPT
PROMPT HeapCompression detection
PROMPT -------------------------------------------

PROMPT

PROMPT OWNER,TABLE_NAME,COMPRESS_FOR,HOST_NAME,INSTANCE_NAME
-- liste les tables compressées si HeapCompression a eté utilisé
SELECT 
'"' || owner       ||'","'||
table_name         ||'","'||
compress_for       ||'","'||
'&&HOST_NAME'      ||'","'||
'&&INSTANCE_NAME'  ||'"' as result
FROM dba_tables ,DBA_FEATURE_USAGE_STATISTICS
WHERE compress_for IN('FOR ALL OPERATIONS','OLTP','QUERY LOW','QUERY HIGH','ARCHIVE LOW','ARCHIVE HIGH')
AND name='HeapCompression';

SPOOL OFF

SPOOL &&OUTPUT_PATH.datapump_compression.csv


PROMPT
PROMPT
PROMPT Datapump compression detection
PROMPT -------------------------------------------

PROMPT

PROMPT FEATURE_INFO,DETECTED_USAGES,FIRST_USAGE_DATE,LAST_USAGE_DATE,HOST_NAME,INSTANCE_NAME
-- liste les utilisation reel de compression via datapump
SELECT 
'"' || FEATURE_INFO    ||'","'||
DETECTED_USAGES       ||'","'||
FIRST_USAGE_DATE      ||'","'||
LAST_USAGE_DATE       ||'","'||
'&&HOST_NAME'      ||'","'||
'&&INSTANCE_NAME'  ||'"' as result
FROM DBA_FEATURE_USAGE_STATISTICS 
WHERE  detected_usages > 0 
and name like '%Datapump%' 
and (regexp_like(lower(to_char(feature_info)), '*compression used: [1-9]* times*') or regexp_like(lower(to_char(feature_info)), 'compression used: *true'));

SPOOL OFF

EXIT