
function init_admin()
{

	
    this.show =  function()
    {
   	   this.admin_script.load("/?mod=admin&fct=get_list_script&type=json&session_id="+session_id);
   	   this.admin_config.load("/?mod=admin&fct=get_list_config&type=json&session_id="+session_id);
  
       this.client_reload()
       
    }
    
/********************************************************/
/*		GESTION CLIENT									*/
/********************************************************/

    var client_reload = function()
    {
       admin_user.clearData();
       admin_client.load("/?mod=admin&fct=get_list_client&type=json&session_id="+session_id,
       function(e)
       {
       		if(!e.is_data)
       			$("#admin_config_create_database").show();
       		else
       			$("#admin_config_create_database").hide();

       	   e.findFirstTd(0,client).trigger("click");
       });

    };	

    this.client_reload = client_reload;

    var admin_client = new table("#admin_client",this,{clickfirst:{col:0,value:client}});
	this.admin_client = admin_client;

	admin_client.beforeDraw = function(e)
	{
		/* ajoute une ligne vide pour l'icone d'ajout*/
		e.data.push([{v:""}]);
	}

	
	
	admin_client.draw = function(e)
	{
		if(e.col_index==1)
		{
			
			var icon = "fa-plus-square-o";
			var text = "Add a new client";
			if(e.row_data[0].v!="")
			{
				icon = "fa-trash-o";
				text = "Remove this client";
			}
			return '<span class="fa '+icon+' fa-2x " data-toggle="tooltip" title="'+
				  trad(text)+'"></span>';									                                    	                        

		}
		else if(e.col_index==2)
		{
			if(e.row_data[0].v=="")
				return ;
			return '<span data-index='+e.row_index+' class="fa fa-pencil fa-2x " data-toggle="tooltip" title="'+
					  trad("Edit client")+'"></span>';

		}
		

	};

         

    var new_client;
  
    admin_client.click=function(e)
	{
	    // selectionne un client
	    if(e.tr.find("span.fa-trash-o").length==0)
	    {
	    	if($(e.target).hasClass("fa-plus-square-o"))
			{
				 if(!checkRole("superadmin",true))
					return;
				//add new client
				$("#admin_client_edit_validate").prop("disabled",true);
				$("#admin_client_edit_name").val("");
				$("#admin_client_edit_name_alert").text(trad("Name need"));
				$("#admin_client_edit_name_alert").show();
				showModal("#admin_client_edit_modal",trad("New Client"));

			}
	    
	       return;
	    }
	    new_client = e.row_data[0].v;
	   
		$.get("/?mod=admin&fct=select_client&session_id="+
		   session_id+"&client="+new_client,
		   function(res)
		   {
			  if(res == "ok") 
			  {
				  client = new_client;
				  $("#main_client").text(client);

				  admin_user.load("/?mod=admin&fct=get_list_user&type=json&session_id="+session_id);

			  }
			  else
				  client_reload();
		   });


		if($(e.target).hasClass("fa-pencil"))
	    {
	    	if(!checkRole("admin",true))
		 		return;
	    }
	    else if($(e.target).hasClass("fa-trash-o"))
	    {
	    	if(!checkRole("superadmin",true))
		 		return;
	        // remove client
	        showAsk(trad("Do you really want to delete this client ?"),
	        function(res)
	        {
                if(res=="validate")
                {
                    var remove_client = $("#admin_client tr.selected td:first").text();

                    $.get("/?mod=admin&fct=remove_client&session_id="+
                       session_id+"&client="+remove_client,
                       function(res)
                       {
                           admin_client.reload();  
                           hideInfo();
                       });
                }
	        });
	    }


	};
   



	 $("#admin_client_edit_name").on("keyup",function()
	   {
		   // verifie si le client existe deja
		   new_client = $("#admin_client_edit_name").val().toLowerCase().trim();

		  var check_client = false ;

		  $.each(admin_client.data,function(i,o) 
			{
				if(o[0] == new_client)
				check_client = true;
			} );

		   if(check_client)
		   {
		   	  $("#admin_client_edit_name_alert").text(trad("Name used"));
			  $("#admin_client_edit_name_alert").show();
			  $("#admin_client_edit_validate").prop("disabled",true);
		   }
		   else
		   {
		   	 if(new_client=="")
		   	 	$("#admin_client_edit_name_alert").text(trad("Name need"));
			  $("#admin_client_edit_name_alert").hide()
			  $("#admin_client_edit_validate").prop("disabled",false);
		   }
	   })

	$("#admin_client_edit_validate").click(function()
	{	

		 showInfo(trad("work in progress"));
	                $.get("/?mod=admin&fct=add_client&session_id="+
	                       session_id+"&client="+new_client,
	                       function(res)
	                       {
                               client = new_client;
                               client_reload();
	                           hideInfo();
	                       });
	});


/********************************************************/
/*		GESTION USER									*/
/********************************************************/

	var admin_user = new table("#admin_user",this);
	this.admin_user = admin_user;
	
	admin_user.draw = function(e)
	{

		if(e.col_index==4)
		{
			
			var icon = "fa-plus-square-o";
			var text = "Add a new user";
			if(e.row_data[0].v!="")
			{
				icon = "fa-trash-o";
				text = "Remove this user";
			}
			return '<span data-index='+e.row_index+' class="fa '+icon+' fa-2x " data-toggle="tooltip" title="'+
				  trad(text)+'"></span>';									                                    	                        

		}
		else if(e.col_index==5)
		{
			if(e.row_data[0].v=="")
				return;
			return '<span data-index='+e.row_index+' class="fa fa-pencil fa-2x " data-toggle="tooltip" title="'+
				  trad("Edit user")+'"></span>';

		}
		

	};

	admin_user.beforeDraw = function(e)
	{
		/* ajoute une ligne vide pour l'icone d'ajout*/
		e.data.push([{v:""}]);
	}

	var edit_user_name;
	var edit_user_id;
	// clic sur l'icone action du user
	admin_user.click = function(e)
	{
		if(e.col_index==null || e.col_index<4)
			return;
		if(!checkRole("admin",true))
		 	return;     
      
	    if($(e.target).hasClass("fa-plus-square-o"))
	    {
            //add new user
           	edit_user_name = "";
           	edit_user_id  = 0;
           	$("#admin_user_edit_name").val("");
           	$("#admin_user_edit_pass").val("");
           	$("#admin_user_edit_role").val("user");
           	$("#admin_user_edit_pass").prop("type","password");
           	$("#admin_user_edit_name_alert").text(trad("User need"));
           	$("#admin_user_edit_name_alert").show();
			$("#admin_user_edit_validate").prop("disabled",true);
			
			showModal("#admin_user_edit_modal",trad("Add new user"));
		  
	    }
	    else if($(e.target).hasClass("fa-pencil"))
	    {
            //modify user
           
         	edit_user_name = e.row_data[1].v.toLowerCase().trim();
         	edit_user_id = e.row_data[0].v;

         	         	
         	$("#admin_user_edit_name_alert").hide();
         	$("#admin_user_edit_pass").prop("type","password");
         	$("#admin_user_edit_name").val(e.row_data[1].v);
           	$("#admin_user_edit_role").val(e.row_data[2].v);
           	$("#admin_user_edit_pass").val(e.row_data[3].v);
			$("#admin_user_edit_validate").prop("disabled",false);
			
			showModal("#admin_user_edit_modal",trad("Edit user : "+edit_user_name));
	    
	    }
	    else
	    {	    
	    
	        // remove user
	        showAsk(trad("Do you really want to delete this user ?"),
	        function(res)
	        {
                if(res=="validate")
                {
         
                    $.get("/?mod=admin&fct=delete_user&session_id="+
                       session_id+"&id="+ e.row_data[0].v,
                       function(res)
                       {
                           admin_user.reload();  
                           hideInfo();
                       });
                }
	        });
	    }
	   
	};


	$("#admin_user_edit_validate").click(function()
	{
		 var user = $("#admin_user_edit_name").val().toLowerCase().trim();
		 var role = $("#admin_user_edit_role").val();
		 var pass = $("#admin_user_edit_pass").val();
	
		 $.get("/?mod=admin&fct=add_update_user&session_id="+
		   session_id+"&user="+user+"&pass="+pass+"&role="+role+"&id="+edit_user_id ,
		   function(res)
		   {
			   admin_user.reload();
 
			   hideInfo();
		   });
	
	});

	
	
    $("#admin_user_edit_name").on("keyup",
	   function()
	   {
		   // verifie si le user existe deja
		   var new_user = $("#admin_user_edit_name").val().toLowerCase().trim();

		   var check_user = false;
		   $.each(admin_user.data,function(i,o)
		   {
		   		if(o[1]==new_user)		   				   		
		   			check_user = true;
		   });
		  
			
		   if(edit_user_name!=new_user && check_user)
		   {
		   	  if(new_user!="")
		   	  	$("#admin_user_edit_name_alert").text(trad("User exist"));
		   	  else
		   	  	$("#admin_user_edit_name_alert").text(trad("User need"));
			  
			  $("#admin_user_edit_name_alert").show();
			  $("#admin_user_edit_validate").prop("disabled",true);
		   }
		   else
		   {
			  $("#admin_user_edit_name_alert").hide()
			  $("#admin_user_edit_validate").prop("disabled",false);
		   }
	   })

	 $("#admin_user_edit_show_pass").click(function()
	 {
	 	if($("#admin_user_edit_show_pass").prop("checked"))
	 		$("#admin_user_edit_pass").prop("type","text");
	 	else
	 		$("#admin_user_edit_pass").prop("type","password");
	 })
	

/********************************************************/
/*		GESTION SCRIPT									*/
/********************************************************/
		
	var admin_script = new table("#admin_script",this);
	this.admin_script = admin_script;
	
	admin_script.draw = function(e)
	{
		if(e.col_index!=2)
			return ;
		return '<span data-index='+e.row_index+' class="fa fa-pencil fa-2x " data-toggle="tooltip" title="'+
								  trad("Edit Script")+'"></span>';
	};

	admin_script.click = function(e)
	{
		if(e.col_index!=2)
			return;
		var script = e.row_data[0].v;
	    
	    $.get("/?mod=admin&fct=get_script&type=json&session_id="+
	       session_id+"&script="+script,
	    function(res)
	    {	    	

	    	showModal("#admin_script_edit_modal",trad("Edit script : ")+script);
	        $("#admin_script_editor").val(res.script);
	        $("#admin_script_log").val(res.log);
	
	    })
	}

	$("#admin_script_edit_validate").click(function()
	{
		if(!checkRole("superadmin",true))
			return;
		showInfo("Operation en cours...");
		var text = $("#admin_script_editor").val();
		var script = $("#admin_script tr.selected td:first").text();
		$.post("/?mod=admin&fct=update_script&script="+script+"&session_id="+session_id,text,
		function(res)
		{
			 hideInfo();
      		 admin_script.reload();     
 
		});
		

	});

	$("#admin_script_download").click(function()
    {
    	download("scripts.zip?download&mod=admin&fct=download_script&session_id="+session_id);
    });

    // ouvre la fenetre de selection d'une archive
	$("#admin_script_choose").click(function()
	{
		if(!checkRole("admin",true))
			return;
		$("#admin_script_choose_input").val("");
		$("#admin_script_choose_input").trigger("click");
		
	});

	//fichier excel selectionné
	$("#admin_script_choose_input").on("change",function()
	{
		
		var file = $("#admin_script_choose_input")[0].files[0];
									
		showAsk(trad("Do you really want to upload this file ?"),function(res)
		{
			if(res=="validate")
			{
				
				$("#admin_script_upload")[0].action= "?upload&mod=admin&fct=upload_script"+
							"&session_id="+session_id+"&file="+file.name;
				submit($("#admin_script_upload")[0],
				function(res)
				{

					if(res == "no_change")		
						res = trad("No change detected");		
					else if(res=="ko")
						res = trad("Import failed");
					else
						res = trad("Script imported");
	
					history_index = null;
				    admin_script.reload();
       
					hideInfo(res);		

				});

				showInfo("Operation en cours...");
			}
		});
	});



/********************************************************/
/*		GESTION CONFIG									*/
/********************************************************/
		
	var admin_config = new table("#admin_config",this);
	this.admin_config = admin_config;

	admin_config.draw = function(e)
	{
		if(e.col_index==1 && 
			(e.row_data[0].v=="oracle_password" || 
			 e.row_data[0].v=="connexion_string"))
			return "************";
	};

	$("#admin_config_create_database").click(function()
	{
		showInfo("Operation en cours...");

		$.get("/?mod=admin&fct=create_database&session_id="+ session_id,
		function(res)
		{
			if(res=="ko")
			{
				hideInfo("Creation failed !");
			}
			else
			{
				client_reload();
				hideInfo();
			}
		});
	});
	
	
	$("#admin_config_modify").click(function()
	{
		$(".admin_config_alert").hide();
		$("#admin_config_connexion_string").val(admin_config.findFirstRow(0,"connexion_string")[1].v);
		$("#admin_config_http_server_port").val(admin_config.findFirstRow(0,"http_server_port")[1].v);
		$("#admin_config_oracle_user").val(admin_config.findFirstRow(0,"oracle_user")[1].v);
		$("#admin_config_oracle_pass").val(admin_config.findFirstRow(0,"oracle_password")[1].v);
		$("#admin_config_login_timeout").val(admin_config.findFirstRow(0,"login_timeout")[1].v);
		$("#admin_config_audit_time").val(admin_config.findFirstRow(0,"audit_time")[1].v);
		$("#admin_config_psql_path").val(admin_config.findFirstRow(0,"psql_path")[1].v);
		$("#admin_config_pgpass_path").val(admin_config.findFirstRow(0,"pgpass_path")[1].v);
		
		var client = admin_config.findFirstRow(0,"client")[1].v;
		// remmplis la liste des client
		var client_list = $("#admin_config_client_list");
		if(admin_client.data!=null)
		{
			admin_client.data.forEach(function(e)
			{
				client_list.append($("<option "+(e[0].v== client?"selected":"")+"/>").val(e[0].v).text(e[0].v));

			});			
		}
		else
		{	
			client_list.append($("<option selected />").val(client).text(client));

		}
	
		$("#admin_config_edit_modal").show();
	});
	
 	$("#admin_config_oracle_show_pass").click(function()
	 {
	 	if($("#admin_config_oracle_show_pass").prop("checked"))
	 		$("#admin_config_oracle_pass").prop("type","text");
	 	else
	 		$("#admin_config_oracle_pass").prop("type","password");
	 });

	 $("#admin .check_value").on("keyup",
	   function()
	   {		  			
		
		  if($(this).val().trim() == "")		  
		  	 $(this).parent().find(".admin_config_alert").show();		  
		  else
		 	 $(this).parent().find(".admin_config_alert").hide();
	   })

	 $("#admin_config_edit_validate").click(function()
	 {
	 	showInfo("Operation en cours...");

	 	var data ={
		connexion_string: $("#admin_config_connexion_string").val(),
		http_server_port: $("#admin_config_http_server_port").val(),
		oracle_user: $("#admin_config_oracle_user").val(),
		oracle_password: $("#admin_config_oracle_pass").val(),
		login_timeout: $("#admin_config_login_timeout").val(),
		audit_time: $("#admin_config_audit_time").val(),
		client: $("#admin_config_client_list").val(),
		psql_path: $("#admin_config_psql_path").val(),
		pgpass_path: $("#admin_config_pgpass_path").val(),
	
		url:window.location.href
	 	}	
		 $.post("/?mod=admin&fct=update_config&session_id="+ session_id,JSON.stringify(data),
		   function(res)
		   {
				
			  
			   if(res=="ko")
			   {
 					hideInfo(trad("Update failed !"));	
			   }			 
			   else if(res =="ok")
			   {
			   	 admin_config.reload(); 
			   	 client_reload();
				 hideInfo();	
			   }
			   else
			   {
			   	    // on a recu une nouvelle adresse de site
			   		setTimeout(function()
			   		{
			   			window.location.href = res;
			   		},3000);
					
			   }
			  
		   });
	
	});



	
    $("#admin_config_download").click(function()
    {
 		if(!checkRole("superadmin",true))
		 	return;
    	download("licence_conformity_"+version+".zip?download&mod=admin&fct=download_app&session_id="+session_id);
    });

    
    // ouvre la fenetre de selection d'une archive
	$("#admin_config_choose").click(function()
	{
		 if(!checkRole("admin",true))
		 	return;
		$("#admin_config_choose_input").val("");
		$("#admin_config_choose_input").trigger("click");
		
	});
	
	//fichier excel selectionné
	$("#admin_config_choose_input").on("change",function()
	{
											
		showAsk(trad("Do you really want to upload this file ?"),function(res)
		{
			if(res=="validate")
			{
				var file = $("#admin_config_choose_input")[0].files[0];
				$("#admin_config_upload")[0].action= "?upload&mod=admin&fct=upload_app"+
													"&file="+file.name+"&session_id="+session_id;
				submit($("#admin_config_upload")[0],
				function(res)
				{
					if(res=="ok")
					{
						showInfo("Server restart ...");
						$.get("/?mod=admin&fct=restart_app&session_id="+ session_id);
						 //on redemarre les serveur
						setTimeout(function()
						{
							window.location.reload();
						},5000);
					}
					else
					{
						hideInfo(trad("Upload failed !"));		
					}

				});

				showInfo("Operation en cours...");
			}
		});
	});

}
