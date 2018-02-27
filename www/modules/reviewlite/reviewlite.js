


function init_reviewlite()
{
	var review_lite_file;

    this.show = function()
    {

        this.server_list.load("/?mod=reviewlite&fct=get_reviewlite_server_list&type=json&session_id="+session_id);
        this.database_list.load("/?mod=reviewlite&fct=get_reviewlite_database_list&type=json&session_id="+session_id);
      

        $.get("/?mod=reviewlite&fct=get_last_archive_name&session_id="+session_id,
        function(res)
        {
			review_lite_file = res;
        })
    }

	
    $("#reviewlite_download").click(function()
    {

    	download(review_lite_file+"?download&mod=reviewlite&fct=download&session_id="+session_id);
    });

    $("#reviewlite_launch").click(function()
    {
    	 if(!checkRole("superuser",true))
		 	return;
    	var servers = [];
    	
    	$.each($("#reviewlite td input[type='checkbox']"),function(i,o)
    	{
    		if($(o).prop("checked"))
    			servers.push(server_list.data[i][2]);
    	});
    	

   		if(servers.length==0)
   		{
   			hideInfo(trad("You have to check a server at least to proceed "));
   			return;
   		}

   		showAsk(trad("Do you really want to launch reviewlite for checked server ?"),
   		function(res)
   		{
   			if(res == "validate")
   			{
   				showInfo(trad("Work in progress"));
    	
				$.post("/?mod=reviewlite&fct=launch_reviewlite&session_id="+session_id,
							JSON.stringify(servers)).done(
				function (res)
				{
					server_list.reload();	
					database_list.reload();		
					if(res == "ok")
						hideInfo(trad("Data updated"));
					else
						hideInfo(trad("Can't update data !"));
				});
   			}
   		})
    	
    	
    });


    $("#reviewlite_select_all").click(function()
    {
    	var checked = $("#reviewlite_select_all").prop("checked")?"checked":"";
    	$("#reviewlite input[type='checkbox']").prop("checked",checked);
    	
    });

    $("#reviewlite_server_config").click(function()
	{
		 if(!checkRole("superuser",true))
		 	return;
		var data = $("#reviewlite_server_row tr.selected td");
		if(data.length==0)
			return;
		var hour = $("#reviewlite_start").val();
		var port = $("#reviewlite_port").val();
	
		var server = $(data[2]).text();
		$.get("/?mod=reviewlite&fct=update_server_config&type=json&session_id="+session_id+
			"&start_hour="+hour+"&sqlplus_port="+port+"&physical_srv_name="+server,function(res)
		{
			if(res.error==null)
			{
				server_list.updateCell(3,res.start_hour);
				server_list.updateCell( 4,res.sqlplus_port)	;						
			}
		});
		
	});
		

    // ouvre la fenetre de selection d'une archive
	$("#reviewlite_choose").click(function()
	{
		 if(!checkRole("superuser",true))
		 	return;
		$("#reviewlite_choose_input").val("");
		$("#reviewlite_choose_input").trigger("click");
		
	});
	
	//fichier zup selectionné
	$("#reviewlite_choose_input").on("change",function()
	{
		
		var file = $("#reviewlite_choose_input")[0].files[0];
									
		showAsk(trad("Do you really want to upload this file ?"),function(res)
		{
			if(res=="validate")
			{
				var file = $("#reviewlite_choose_input")[0].files[0];
				$("#reviewlite_upload")[0].action= "?upload&mod=reviewlite&fct=upload_reviewlite"+
													"&file="+file.name+"&session_id="+session_id;
				submit($("#reviewlite_upload")[0],
				function(res)
				{

					if(res == "no_change")		
						res = trad("No change detected");		
					else if(res=="ko")
						res = trad("Import failed");
					else
						res = trad("Data imported");

					server_list.reload();	
					database_list.reload();
					
					hideInfo(res);		

				});

				showInfo("Operation en cours...");
			}
		});
	});

	

	
    // definition des listes
	var server_list = new table('#reviewlite_server',this);
	this.server_list = server_list;
    server_list.draw = function(e)
	{
		if(e.col_index==0)		
			return '<input type="checkbox" data-index="'+e.row_index+'" '+e.cell_data+'>';		  
		if(e.col_index==1)
		{
			var icon = "";
			var text = "";
			var class_name= e.cell_data.v;
			switch(class_name)
			{
				case "missing":
					icon="fa-circle";
					text=trad("Server missing");                            
					break;
				case "present":
					icon="fa-circle";
					text=trad("Server present");
					break;

			break;
			}

			return '<span class="'+class_name+' action fa '+icon+
						' fa-2x " data-toggle="tooltip" title="'+text+'"><span>'+
						e.cell_data.v+'</span></span>';									  
		}
		if(e.col_index ==3)
			return formatTimeFromMinutes(e.cell_data.v);

         if(e.col_index==5 || e.col_index==6)
         	if(e.cell_data.v==null)
         		return;
         	else
         		return e.cell_data.v.substr(0,16);
						
        };
    
     this.server_list = server_list;


     // clic sur une ligne du tableau de l'historique, raffraicie la list detail
	this.server_list.click = function(e)
	{
		
		if(e.row_data==null)
			return;
		var server = e.row_data[2].v;
	
		database_list.filter(1,server);
  
       $("#reviewlite_start").val(formatTimeFromMinutes(e.row_data[3].v));
       $("#reviewlite_port").val(e.row_data[4].v);

       var input = $(this).find("input");
	   var index = $(input).data("index");
		var checked = $(input).prop("checked")?"checked":"";
	
	};


    
    var database_list = new table("#reviewlite_database",this);
	this.database_list = database_list;

	database_list.draw = function(e)
	{
		if(e.col_index==0)
		{
											                                    	                        
 			var icon = "";
			var text = "";
			var class_name= e.cell_data.v;
			switch(class_name)
			{
				case "missing":
					icon="fa-circle";
					text=trad("Database missing");                            
					break;
				case "present":
					icon="fa-circle";
					text=trad("Database present");
					break;

				default:
					return;			
			}

			return '<span class="'+class_name+' action fa '+
					icon+' fa-2x " data-toggle="tooltip" title="'+
					text+'"><span>'+e.cell_data.v+'</span></span>';	
		}
	
		

	};


  
}