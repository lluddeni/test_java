#!/bin/bash
# 18/07/2016	PBE	adaptation du script pour prendre en compte le lancement du script sql avec echo à on
# 02/08/2016	PBE	ajout fichier de verification du parametre control_management_pack_access

# creation des fichiers resultats 
nom_fic_hwm="./audit_hwm_sessions.txt"
nom_fic_release="./audit_release.txt"
nom_fic_feature="./audit_feature.txt"
nom_fic_spatial="./audit_spatial.txt"
nom_fic_part="./audit_part.txt"
nom_fic_control_mgmt="./audit_control_mgmt.txt"
nom_fic_cpu_max="./audit_cpu_max.txt"
nom_fic_heap_compression="./audit_heap_compression.txt"
nom_fic_datapump_compression="./audit_datapump_compression.txt"

echo " " > $nom_fic_part

echo "Serveur | Base | Schema | Segment " > $nom_fic_spatial

echo  "Serveur | Base | HWM sessions" > $nom_fic_hwm

echo "Serveur| Base| Version| Edition " > $nom_fic_release

echo "Serveur| Base| Feature| detected_usage| total_samples| first_usage| last_usage" > $nom_fic_feature

echo " " > $nom_fic_control_mgmt

echo "Serveur | DB | CPU_COUNT | CPU_CORE_COUNT | CPU_SOCKET_COUNT  " > $nom_fic_cpu_max

echo " Host_name | Instance_name | Owner | table_name | Compress_for" > $nom_fic_heap_compression
echo " HOST_NAME |INSTANCE_NAME | FEATURE_INFO | DETECTED_USAGES | FIRST_USAGE_DATE | LAST_USAGE_DATE" > $nom_fic_datapump_compression

# fichier control_mgmt
######################
echo "-----------------"
echo " recuperation Control_mgmt : génération du fichier $nom_fic_control_mgmt "
echo "-----------------"
for f in `find . -name *options.csv -print` 
do
echo "process $f"

# recup nom de la base
	nom_base=`echo $f | cut -d '_' -f 3`

# grep du nom de la base, puis du parametr control_management_pack_access
ligne=`grep $nom_base $f | grep "control_management_pack_access" | tr -d '"'`

# passe au suivant si la ligne est vide (base < 11g)
[[ -z  $ligne  ]] && continue;

#recuperation des elements correspondants

nom_base=`echo $ligne | cut -f3 -d,`
nom_serveur=`echo $ligne | cut -f2 -d,`
parametre=`echo $ligne | cut -f12 -d,`
valeur=`echo $ligne | cut -f13 -d,`


echo "$nom_serveur|$nom_base|$parametre|$valeur" >> $nom_fic_control_mgmt


done

#fin fichier control_mgmt



# fichier HWM
###############
echo "-----------------"
echo " recuperation HWM : génération du fichier $nom_fic_hwm "
echo "-----------------"
for f in `find . -name *license*.csv -print` 
do
echo "process $f"

# recup nom de la base
	nom_base=`echo $f | cut -d '_' -f 3`

# grep du nom de la base, on ne traite que la 1° ligne renvoyée
ligne=`grep $nom_base $f | sed -n "1 p"`

#recuperation des elements correspondants

nom_base=`echo $ligne | cut -f8 -d,`
nom_serveur=`echo $ligne | cut -f7 -d,`
hwm_base=`echo $ligne | cut -f5 -d,`

echo "$nom_serveur|$nom_base|$hwm_base" >> $nom_fic_hwm

done

#fin fichier hwm


# fichier release
###############
echo "-----------------"
echo " recuperation release : : génération du fichier $nom_fic_release"
echo "-----------------"
for f in `find . -name *version*.csv -print` 
do
echo "process $f"

# recup nom de la base
	nom_base=`echo $f | cut -d '_' -f 3`


# grep du nom de la base, on ne traite que la 1° ligne renvoyée
ligne=`grep $nom_base $f  | sed -n "1 p" | tr -d '"'`


#recuperation des elements correspondants

nom_base=`echo $ligne | cut -f4 -d,`
nom_serveur=`echo $ligne | cut -f3 -d,`
release=`echo $ligne | cut -f2 -d,`

echo "$nom_serveur|$nom_base|$release" >> $nom_fic_release

done
# fin fichier release


# fichier feature
###############
echo "-----------------"
echo " recuperation feature : : génération du fichier $nom_fic_feature"
echo "-----------------"
for f in `find . -name *feature*.csv -print` 
do
	# recup nom de la base
	nom_base=`echo $f | cut -d '_' -f 3`
	
	echo "process $f : $nom_base" 
	
	# grep du nom de la base dans le fichier
	grep ",\"$nom_base\"," $f  | awk -F'"' -v OFS='' '{ for (i=2; i<=NF; i+=2) gsub(",", "", $i) } 1' | awk  -F , '{OFS="|"; print $16, $17, $3, $5, $6, $8, $9}' | tr -d '"' >> $nom_fic_feature
		#echo "$nom_serveur | $nom_base | $composant | $detected_usages | $total_samples | $first_usage | $last_usage  " >> $nom_fic_feature
	#done
	
done
# fin fichier feature

# fichier spatial
###############
echo "-----------------"
echo " recuperation spatial : : génération du fichier $nom_fic_spatial"
echo "-----------------"
for f in `find . -name *options*.csv -print` 
do
	# recup nom de la base
	nom_base=`echo $f | cut -d '_' -f 3`
	
	echo "process $f : $nom_base"

	grep ",ALL_SDO_GEOM_METADATA," $f | grep -v "ORA-00942" | awk -F , '{OFS=",";print $5, $6, $11, $12}' >> $nom_fic_spatial


done
# fin fichier spatial


# fichier part
###############
echo "-----------------"
echo " recuperation segments partitionnes : génération du fichier $nom_fic_part"
echo "-----------------"
for f in `find . -name *segments*.csv -print` 
do
	echo "process $f" 
	# recup nom de la base
	nom_base=`echo $f | cut -d '_' -f 3`
	
	# grep nom base, suppression des segments appartenant à SYS ou SYSTEM
	grep $nom_base $f | grep -v ",SYS," | grep -v ",SYSTEM," | grep -v "SYSMAN," | grep -v "AUDSYS" >> $nom_fic_part 
	
	

done
# fin fichier part


# fichier cpu
###############
echo "-----------------"
echo " recuperation cpu max $nom_fic_cpu_max"
echo "-----------------"
for f in `find . -name *options*.csv -print` 
do
			
	grep ",DBA_CPU_USAGE_STATISTICS," $f  |  awk -F , '{OFS=",";print $5, $6,$12,$13,$14,$15}' >> $nom_fic_cpu_max 	

done
# fin fichier cpu


# fichier heapcompression
###############
echo "-----------------"
echo " recuperation heap_compression : génération du fichier $nom_fic_heap_compression"
echo "-----------------"
for f in `find . -name *heap_compression*.csv -print` 
do
	# recup nom de la base
	nom_base=`echo $f | cut -d '_' -f 3`
	
	echo "process $f : $nom_base" 
	
	# grep du nom de la base dans le fichier
	grep "\"$nom_base\"" $f  | awk -F'"' -v OFS='' '{ for (i=2; i<=NF; i+=2) gsub(",", "", $i) } 1' | awk  -F , '{OFS="|"; print  $4, $5, $1, $2, $3}' | tr -d '"' >> $nom_fic_heap_compression
		
	#done
done
# fin fichier heapcompression

# fichier datapump
###############
echo "-----------------"
echo " recuperation datapump : : génération du fichier $nom_fic_datapump"
echo "-----------------"
for f in `find . -name *datapump_compression*.csv -print` 
do
	# recup nom de la base
	nom_base=`echo $f | cut -d '_' -f 3`
	
	echo "process $f : $nom_base" 
	
	# grep du nom de la base dans le fichier
	grep "\"$nom_base\"" $f  | awk -F'"' -v OFS='' '{ for (i=2; i<=NF; i+=2) gsub(",", "", $i) } 1' | awk  -F , '{OFS="|"; print  $5, $6, $1, $2, $3, $4}' | tr -d '"' >> $nom_fic_datapump_compression
		
	#done
	
done
# fin fichier datapump

