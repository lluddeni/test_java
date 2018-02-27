

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

                       SELECT DISTINCT public.pack

                       FROM public.feature_pack p

                       WHERE EXISTS (SELECT 1

                                     FROM public.feature f

                                     WHERE f.feature = p.feature AND p.pack is not null)

                       ORDER BY pack

                       $$

) AS ct("Physical server name" varchar(255)




);


