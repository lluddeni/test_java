
function init_inventory()
{
	var history_id;
	table.select("#inventory_servers");
	this.show = function()
	{
		
		$("#inventory_cancel").click();
		
		table.endEdit();		
		$("#inventory_edit_validate_button").hide();
		$("#inventory_edit_button").show();

	
		inventory_datatable.unselect();
		
		inventory_datatable.load("/?mod=inventory&fct=inventory_history&type=json&session_id="+session_id);

		listDetailReload(0);
	}

	
	// gestion du filtre des actions
	var toggle_filter = $("#inventory_toggle_filter input");
	toggle_filter.click(function()
		{
			var search ="";
			if(!toggle_filter.prop("selected"))
			{
				toggle_filter.prop("selected",true);
				search ="*";
			}
			else
				toggle_filter.prop("selected",false);

			server_list.filter( 0 ,search);
			database_list.filter( 0 ,search);
			licence_list.filter( 0 ,search);
			server_licence_list.filter( 0 ,search);
		}
	)
	
	
	// selectionne une table history
	

	// selectionne une des 4 tables detail
	$("#inventory_select_table label").click(function()
	{
		if(table.isEdited())
			return;
		var target = $(this).data("target");
		$(".inventory_table").css("visibility","hidden");
		$("#inventory_select_table label").removeClass("selected");
		$(this).addClass("selected");
		$(target).css("visibility","visible");
		table.select(target);

		updateEditButton();
	});

	// selectionne un fichier de validation d'import
	$("#inventory_choose_doc").click(function()
	{
		 if(!checkRole("superuser",true))
		 	return;
		$("#inventory_choose_doc_input").trigger("click");
	});
	$("#inventory_choose_doc_input").on("change",function()
	{
		var file = $("#inventory_choose_doc_input")[0].files[0];	
		$("#inventory_choose_doc").attr('data-original-title',file.name);	
		$("#inventory_choose_doc_file").removeClass("fa-times");
		$("#inventory_choose_doc_file").addClass("fa  fa-check fa-2x");
	
	});
	// ouvre la fenetre de selection du excel d'import
	$("#inventory_choose_xlsx").click(function()
	{
		if(!checkRole("superuser",true))
		 	return;
		$("#inventory_choose_xlsx_input").val("");
		$("#inventory_choose_xlsx_input").trigger("click");
		
	});
	
	//fichier excel selectionné
	$("#inventory_choose_xlsx_input").on("change",function()
	{
		
		var file = $("#inventory_choose_xlsx_input")[0].files[0];
		$("#inventory_choose_xlsx").data('original-title',file.name);
		$("#inventory_choose_xlsx_file").addClass("fa-check");
		$("#inventory_choose_xlsx_file").removeClass("fa-times");
		$("#inventory_import,#inventory_cancel").removeClass('inactive');
		
									

	});

	// annule les fichiers selectionné
	$("#inventory_cancel").click(function()
	{
		$("#inventory .import_file").removeClass("fa-check");
		$("#inventory .import_file").addClass("fa-times");
		$("#inventory_import,#inventory_cancel").addClass('inactive');
		$("#inventory_choose_doc_input").val("");
		$("#inventory_choose_xsl_input").val("");
		$("#inventory_choose_doc").attr('data-original-title',trad("Choose inventory doc"));
		$("#inventory_choose_xlsx").attr('data-original-title',trad("Choose inventory xlsx"));
	});

			
	// importe les fichier excel / doc
	$("#inventory_import").click(function()
	{
			
		$("#inventory_upload_xlsx")[0].action= "?upload&mod=inventory&fct=import_inventory&session_id="+session_id;
		submit($("#inventory_upload_xlsx")[0],
		function(history_id)
		{
			
			var file = $("#inventory_choose_doc_input")[0].files[0];
			if(file == null)
			{
				endImport(history_id);
				return;
			}
			file = $("#inventory_choose_doc_input")[0].files[0];
			$("#inventory_upload_doc")[0].action =  "/?upload&mod=inventory&fct=import_doc&history_id="+history_id+
													"&file="+file.name+"&session_id="+session_id;
			submit($("#inventory_upload_doc")[0],endImport);
		
		});
		
		showInfo(trad("Work in progress"));
	});
	
	$("#inventory_get_last").click(function()
	{
		download("inventory.xlsx?download&mod=inventory&fct=get_xlsx_inventory&session_id="+session_id);
	
	});
	
	// fin de l'import
	function endImport(res)
	{
		if(res == "no_change")	
			res = trad("No change detected");		
		else if(res=="ko")
			res = trad("Import failed");
		else
		   res =trad("Data imported");
		
		inventory_datatable.unselect();
		inventory_datatable.reload();	
	
		// deseclectionne les bouton d'import
		$("#inventory_cancel").trigger("click");
		hideInfo(res);
	}

	// definition des listes
	var inventory_datatable = new table('#inventory_action',this);
	this.inventory_datatable = inventory_datatable;

	inventory_datatable.draw = function(e)
	{
		if(e.col_index == 1)
		{
			if(e.cell_data==null || e.cell_data.v.length<16)
				return ;
			  // tronque le timestamp
			return e.cell_data.v.substr(0,16);
		}
		if(e.col_index==5)
		{
			 if(e.cell_data.v!="")
				return "<span class='fa fa-file-excel-o fa-2x' data-toggle='tooltip' title='"+
					trad("Download inventory file")+"' onclick='download(\""+e.cell_data.v+"\")' />";
			return;
		}
		if(e.col_index==6)
		{
			if(e.cell_data.v!="")
				return "<span class='fa fa-file-text fa-2x' data-toggle='tooltip' title='"+
				trad("Download validation file")+"' onclick='download(\""+e.cell_data.v+"\")' />";				  

			return;
		}
		
	}

	inventory_datatable.afterLoad = function()
	{
		if(inventory_datatable.row_count==0)
		{
			$("#inventory_add").removeClass("inactive");
		}
		server_licence_list.clearData();
		licence_list.clearData();
		server_list.clearData();
		database_list.clearData();
	}

	function updateEditButton()
	{
		var e = inventory_datatable.getSelectedRow();
		// on ne peu editer que le dernier historique
		if(e.row_index==0)		
		{	
			$("#inventory_add").removeClass("inactive");
			if(table.select().getSelectedRow().row_index>=0)
				$("#inventory .edit").removeClass("inactive");
			else
				$("#inventory .edit").addClass("inactive");
		}
		else
		{
			$("#inventory .edit").addClass("inactive");
			$("#inventory_add").addClass("inactive");
		}
	}
	
	inventory_datatable.click = function(e)
	{	
		$("#inventory .edit").addClass("inactive");	
		$("#inventory_add").addClass("inactive");		
		
		if(e.row_data==null)
			return;
		if(e.row_index==0)
			$("#inventory_add").removeClass("inactive");	

		history_id = e.row_data[0].v;
		
		// verifie la presence de modif dans toutes les listes
		$.get("/?mod=inventory&fct=check_history_update&type=json&session_id="+session_id+"&history_id="+history_id).done(
		function(res)
		{		
			// met le bouton de selection de liste en bold si des modifs sont presente
			for(var tn in res)
			{
				$("#"+tn).removeClass("font-weight-bold");
				if(res[tn]>0)
					$("#"+tn).addClass("font-weight-bold");
			}
		});

		listDetailReload(history_id);			

	};

	function listDetailReload(history_id)
	{
	
	
		server_list.load("/?mod=inventory&fct=detail_history&history_id="+history_id+
							"&table=inventory_servers"+
							"&session_id="+session_id+"&type=json" );	
																				
		database_list.load("/?mod=inventory&fct=detail_history&history_id="+history_id+
								"&table=inventory_databases"+
								"&session_id="+session_id+"&type=json" );

		licence_list.load("/?mod=inventory&fct=detail_history&history_id="+history_id+
								"&table=licence"+
								"&session_id="+session_id+"&type=json" );
									
		server_licence_list.load("/?mod=inventory&fct=detail_history&history_id="+history_id+
								"&table=inventory_servers_licences"+
								"&session_id="+session_id+"&type=json" );					
	}
 
	var server_list = new table('#inventory_servers',this);

	var database_list = new table('#inventory_databases',this);

	var licence_list  = new table('#inventory_licences',this);

	var server_licence_list = new table('#inventory_server_licences',this);

	$(".inventory_table").css("visibility","hidden");
	$("#inventory_servers").css("visibility","visible");


	server_list.click = function(e)
	{
		updateEditButton();
	}
	database_list.click = server_list.click;
	licence_list.click = server_list.click;
	server_licence_list.click = server_list.click;

	server_list.draw = function(e)
	{
		if(e.col_index == 0)
		{
				// ajoute les icones de fichiers excel
			var icon = "";
			var text = "";
			switch(e.cell_data.v)
			{
				case "modify":
					icon="fa-pencil-square";
					text="Ligne modifiée"
					break;
				case "add":
					icon="fa-plus-square";
					text="Ligne ajoutée"
					break;
				case "delete":
					icon="fa-minus-square";
					text="Ligne effacée"
					break;	
				default:
					return;		
			}
			return '<span class="action fa '+icon+
					' fa-2x " data-toggle="tooltip" title="'+text+
					'">';		
		}
		else if(e.col_name=="used")
		{
			if(!isNaN(e.row_data[4].v) && !isNaN(e.row_data[5].v))
				if(parseInt(e.row_data[4].v)<parseInt(e.row_data[5].v))
			 		e.td.addClass("inventory_error");
		}
		
		
	}

	licence_list.draw = server_list.draw;
	server_licence_list.draw = server_list.draw;
	database_list.draw = server_list.draw;



	server_list.editCheck = function(e,res)
	{
		// appeleé lors de la verification des données edité 
		if(res)
		{				
			$("#inventory_edit_validate").removeClass("inactive");		
		}
		else
			$("#inventory_edit_validate").addClass("inactive");
	};

	licence_list.editCheck = server_list.editCheck;
	server_licence_list.editCheck = server_list.editCheck;
	database_list.editCheck = server_list.editCheck;

	server_list.checkLinkValue = function(e)
	{
		return e.row_data[0].v!='delete';			
	};
	licence_list.checkLinkValue = server_list.checkLinkValue;
	server_licence_list.checkLinkValue = server_list.checkLinkValue;
	database_list.checkLinkValue = server_list.checkLinkValue;



	$("#inventory_remove").click(function()
	{
		showAsk("Are you sure ?",function(res)
		{
			if(res=="validate")
			{
				var t = table.select();				
				var url = "/?mod=inventory&fct=edit_history&session_id="+
						session_id+"&table="+ t.name+"&action=delete";
				
				$.post(url,JSON.stringify(t.getSelectedJSONRow())).done(function(result)
				{
					table.endEdit();
					if(result.error!=null)
						showInfo(result.error);
					inventory_datatable.unselect();
					inventory_datatable.reload();	

				},"json");
			}
		});
	});

	$("#inventory_modify").click(function()
	{		
		// affiche la 1er celluele editable
		table.select().nextEdit();
		$("#inventory_edit_validate_button").show();
		$("#inventory_edit_validate_button").css("visibility","visible");
		$("#inventory_edit_button").hide();
	});

	$("#inventory_add").click(function()
	{		
		// ajoute une nouvelle ligne editable
		table.select().addRowEdit();
		
		$("#inventory_edit_validate_button").show();
		$("#inventory_edit_validate_button").css("visibility","visible");
		$("#inventory_edit_button").hide();
	});



	server_licence_list.isRowEditable = function(res)
	{
		var e = inventory_datatable.getSelectedRow();
		// on ne peu editer que le dernier historique			
		if(e.row_index==0 && res)
			$("#inventory_modify").removeClass("inactive");
		else
			$("#inventory_modify").addClass("inactive");
	};




	server_licence_list.isCellEditable = function(e)
	{
			
		if(e.cell_column.name=="nb")
		{
			// on ne peut editer que le nombre de licence pour la licene database pas pour les options
			var product =  e.row_data[e.to.col_indexes["product"]]; 
			return (product.v + product.n).indexOf("Edition")>=0;
		}

		return true;
	}
		

	$("#inventory_edit_validate").click(function()
	{
		var t = table.select();			
		var url = "/?mod=inventory&fct=edit_history&session_id="+
					session_id+"&table="+t.name+"&action="+
					(t.getSelectedRow().key=="_"?"add":"modify");
		
		$.post(url,JSON.stringify(t.getSelectedJSONRow())).done(function(result)
		{
			table.endEdit();

			if(result.error!=null)
				showInfo(result.error);

			inventory_datatable.unselect();
			inventory_datatable.reload();				
	
		},"json");
		
		$("#inventory_edit_validate_button").hide();
		$("#inventory_edit_button").show();
	});

	$("#inventory_edit_cancel").click(function()
	{
		table.endEdit();
		table.select().reload();
		$("#inventory_edit_validate_button").hide();
		$("#inventory_edit_button").show();
	});
	
}
