


function init_audit()
{
    
    this.show =function()
    {
    	this.audit_alert.unselect();
    	$("#audit_report").html("");
        this.audit_history.load("/?mod=audit&fct=get_list_audit&type=json&session_id="+session_id);
  
  		$.get("/?mod=audit&fct=get_last_audit_check&type=text&session_id="+session_id,function(res)
  		{
  			audit_history.setTitle(trad("Audit list - last check : ")+res.substr(0,16));
  		});
  		
    }	

    $("#audit_boards").on("change",function(e)
    {
    	// on se deplace sur une board
    	var board = $("#audit_boards").val();

		var board_id = "audit_board_"+board;
		var offset = boards[board_id] - $("#audit_report_container").offset().top;
		$("#audit_report")[0].scrollTop = offset;

    	
    });

  
     // definition des listes
	var audit_history = new table("#audit_history",this);
 	this.audit_history = audit_history;

 	audit_history.draw = function(e)
	{
		if(e.col_index==0)	
			return '<span data-id="'+e.cell_data.v+'" class="audit_radio audit_check_disabled fa  fa-thumb-tack fa-2x " data-toggle="tooltip" title="'+trad("Check to compare")+'"></span>';									                                    	                        
    	if(e.col_index==1 || e.col_index==2)    	 
    	{
			if(e.cell_data.v==null || e.cell_data.v.length<16)
				return ;				
			return e.cell_data.v.substr(0,16);
    	}
    	if(e.col_index==5)
    	{    	
    		if(e.cell_data.v !="")
             	return '<span onclick="download(\''+e.cell_data.v+
                	'\')"  class="fa fa-file-archive-o fa-2x " data-toggle="tooltip" title="Download audit data"/>';									                
    	}
			  
	};

	var audit_alert = new table("#audit_alert",this);
	this.audit_alert =audit_alert;

	audit_alert.draw = function(e)
	{
		if(e.col_name=="acktime")    	 
    	{
			if(e.cell_data.v==null || e.cell_data.v.length<16)
				return ;				
			return e.cell_data.v.substr(0,16);
    	}
    	else if(e.col_name=="comment")
    	{
    		  return '<span data-toggle="tooltip" title="'+e.cell_data.v+'">'+e.cell_data.v+'</span>';									                
  
    	}
    	
			  
	};
	audit_alert.click=function(e)
	{
		// on se deplace sur une alerte dans le rapport
		var alert_id = "audit_alert_"+e.row_data[0].v;
		if(report_alerts[alert_id]==null)
			return;
		
		$("#audit tr").removeClass("audit_find_selected");
		$("#"+alert_id).parent().addClass("audit_find_selected");


		 $("#audit_report td").removeClass("audit_alert_selected");
		 var td = $("#"+alert_id);
		 td.addClass("audit_alert_selected");
		
		 // scroll pour rendre l'element concerné par l'alerte visible
		 var ct =  $("#audit_report_container");
		 var ct_pos = {left:ct.offset().left,top:ct.offset().top,h:ct.height(),w:ct.width()};
		 var td_pos = {left:report_alerts[alert_id].left,top:report_alerts[alert_id].top,h:td.height(),w:td.width()};
		
	  	 var ar = $("#audit_report");	
		 var scroll = {left:ar[0].scrollLeft, top:ar[0].scrollTop};

		 if(td_pos.top - ct_pos.top > scroll.top + ct_pos.h - td_pos.h*2)		
 			 ar[0].scrollTop = td_pos.top - ct_pos.top - ct_pos.h +td_pos.h*3;
 		 else if(td_pos.top - ct_pos.top < scroll.top )
 			ar[0].scrollTop = td_pos.top - ct_pos.top - td_pos.h*3;

		if(td_pos.left - ct_pos.left > scroll.left + ct_pos.w - td_pos.w*2)		
 			 ar[0].scrollLeft = td_pos.left - ct_pos.left - ct_pos.w +td_pos.w*3;
 		 else if(td_pos.left - ct_pos.left < scroll.left )
 			ar[0].scrollLeft = td_pos.left - ct_pos.left - td_pos.w*3;
	}

	audit_alert.afterLoad = function()
	{
		if(!checkRole("admin"))
		{
			$("#audit_alert_ack").hide();
			return;
		}
		// si on a au moins une alerte non acquitée, on montre le bouton d'acquitement
		var td = this.findFirstTd("name",function(value)
		{
			return value=="";
		});
		if(td.length>0)
			$("#audit_alert_ack").show();
	    else
	    	$("#audit_alert_ack").hide();

		
	}

	// ack des alerte
	$("#audit_alert_ack").click(function()
	{
		var e = audit_history.getSelectedRow();
		if(e.row_data == null)
			return;
		var history_id =e.row_data[0].v;      
		$.get("/?mod=audit&fct=ack_alerts&type=text&session_id="+session_id+"&id="+history_id,							
        function (res)
        {      
			audit_alert.reload();
        });
	});
	

	 var select_index =0;
	 var selects= [];
	 var report_alerts= [];	
	 var boards=[];

	 // se deplace jusqu'a une difference entre deux audit
	 function scrollToSelect()
	 {
		if(select_index<0)
		{
			select_index = selects.length-1;
			if(select_index<0)
				select_index=0;
		}
		if(select_index>=selects.length)
			select_index = 0;
		if(selects.length==0)
		{
			$("#audit_find_count").text("0/0");
			return;
		}
		$("#audit_find_count").text((select_index+1)+"/"+selects.length);
		var offset = selects[select_index] - $("#audit_report_container").offset().top;
		$("#audit_report")[0].scrollTop = offset;
		$(".audit").removeClass("audit_find_selected");
		$($(".audit")[select_index]).addClass("audit_find_selected");
			
	 }


      $("#audit_print").click(function()
      {
      		var row = audit_history.getSelectedRow()
      		var history_id = row.row_data[0].v;
      		window.open("/modules/audit/print.html?&session_id="+session_id+"&id="+history_id);
      		
      });

      $("#audit_docx").click(function()
      {
      		var row = audit_history.getSelectedRow()
      		var audit_id = row.row_data[0].v;
      		download("audit.docx?download&mod=audit&fct=get_docx&session_id="+session_id+"&id="+audit_id);
      		
      });

      

      $("#audit_find_prev").click(function()
      {
      		
      		select_index--;      		
      		scrollToSelect();	
      });

      $("#audit_find_next").click(function()
      {
      		select_index++;      		
      		scrollToSelect();
		
      });
      $("#audit_find_count").click(function()
      {
      	scrollToSelect();
      })


    
	$('#audit tbody').on('click','.audit_radio',function()
	{
		
	});

	audit_history.click = function(e)
	{			
		if(e.col_index == 0)
		{
			var hasClass = $(e.target).hasClass("audit_check_disabled");
	
			$(".audit_radio").addClass("audit_check_disabled");
			$(".audit_radio").removeClass("audit_check_enabled");
			if(hasClass)
			{
				$(e.target).removeClass("audit_check_disabled");
				$(e.target).addClass("audit_check_enabled");
			}
		}
		select_id = 1;

		var history_id = e.row_data[0].v;	

		var compare = 	$(".audit_check_enabled");
 		var compare_id = $(compare).data("id");

		$(".audit_radio").parent().removeClass("audit2 audit1");
		
 		if(compare_id==null || compare_id == history_id)
 		{
 			compare_id = "";
 			
 		}
 		else
 		{
			compare.parent().addClass("audit1");
 			$(e.tr.find("td")[0]).addClass("audit2");

 		}

  	    audit_alert.load("/?mod=audit&fct=get_list_alert&type=json&session_id="+session_id+
  	    						 "&id="+history_id);
  

		$.get("/?mod=audit&fct=get_audit_json&type=json&session_id="+session_id+"&id="+history_id+"&compare_id="+compare_id,							
        function (res)
        {        	        	
        	// recupere l'audit au format JSON
            $("#audit_report").html(formatReport(res));

            $.each($("#audit textarea"),function(index)
            {
            	$(this).height(this.scrollHeight);
            });

            $("#audit textarea").on("keyup",function()
            {
            	$(this).height("5");
            	$(this).height(this.scrollHeight);

            });

            $("#audit .audit_comment").on("click",function()
            {
            	var id = this.id.replace("audit_comment_","");
            	$(this).hide();
            	$("#audit_textarea_"+id).show();
            	$("#audit_textarea_"+id).focus();
            	$("#audit_textarea_"+id).trigger("keyup");
            

            });

            $("#audit textarea").on("blur",function()
            {
           		var id = this.id.replace("audit_textarea_","");
            	$.post("/?mod=audit&fct=set_audit_comment&type=text&session_id="+
            		session_id+"&audit_id="+history_id+"&id="+id,$(this).val());
            	$(this).hide();
            	$("#audit_comment_"+id).html(replaceAll($(this).val(),"\n","<br/>"));
            	$("#audit_comment_"+id).show();


            });
			$('#audit_report [data-toggle="tooltip"]').tooltip({ trigger: "hover" });

			$('#audit_report [data-original-title="inserted"]').attr('data-original-title',trad("New data"));
            
            selects = [];
            select_index = 0;

            $("#audit_report td").on("click",auditClick);
         
         	// cherche les difference entre 2 audits
         	$("#audit_report")[0].scrollTop = 0;
			$(".audit").each(function(index)
			{
				selects.push($(this).offset().top);
			})
			// chercher les alerte sur le rapport l'audit
			report_alerts=[];
			$(".audit_alert_pos").each(function(index)
			{
				report_alerts[$(this)[0].id] = $(this).offset();
			})
			// cherche les boards
			boards =[];
			$(".audit_board").each(function(index)
			{
				boards[$(this)[0].id] = $(this).offset().top;
			})


			// en cas de comparaison d'audit, affiche les fleches de navigation vers les differences
			if(compare_id!="")
			{
				$("#audit_find").show();
				scrollToSelect();
			}
			else
				$("#audit_find").hide();

			// remplis la liste des boards d'audit
			var audit_board = $("#audit_boards");
			audit_board.empty();

			if(ordered_boards!=null)
				ordered_boards.forEach(function(board,i)
				{		
					var cl=board.alert==null?"":"class='audit_board_option'";
					
					$("<option "+cl+" value='"+board.name+"'>"+board.desc+"</option>").appendTo(audit_board);
				});



            hideInfo();
        });   	
		

	}

	 // ouvre la fenetre de selection d'une archive
	$("#audit_from_file").click(function()
	{
		 if(!checkRole("superuser",true))
		 	return;
		$("#audit_choose_input").val("");
		$("#audit_choose_input").trigger("click");
		
	});

	//fichier excel selectionné
	$("#audit_choose_input").on("change",function()
	{		
		var file = $("#audit_choose_input")[0].files[0];
									
		showAsk(trad("Do you really want to upload this file ?"),function(res)
		{
			if(res=="validate")
			{
				var audit_use_data = $("#audit_use_data").prop("checked")?"1":"0";
				
				$("#audit_upload")[0].action= "?upload&mod=audit&fct=upload_audit"+
							"&use_data="+audit_use_data+"&session_id="+session_id;
				submit($("#audit_upload")[0],
				function(res)
				{

					if(res == "no_change")		
						res = trad("No change detected");		
					else if(res=="ko")
						res = trad("Import failed");
					else
						res = trad("Data imported");
	
				    audit_history.reload();
					
					hideInfo(res);		

				});

				showInfo("Operation en cours...");
			}
		}).append("<span style='margin:auto'><label for='audit_use_data'>use this data as current</label> <input id='audit_use_data' type='checkbox'/></span>");
	});


     $("#audit_from_local").click(function()
     {
        if(!checkRole("superuser",true))
		 	return;
   		showAsk(trad("Do you really want to execut audit on last data ?"),
   		function(res)
   		{
   			if(res == "validate")
   			{
   				showInfo(trad("Work in progress"));
    	
				$.get("/?mod=audit&fct=local_audit&session_id="+session_id,							
				function (res)
				{
					if(res=="no_change")
					{
						hideInfo(trad("No Change"));
						return;
					}
					else if(res=="ko")
					{
						hideInfo(trad("Audit failed !"));
						return;
					}
					 $("#audit_report").text(res);
					 audit_history.unselect();
  			         audit_history.reload();
  
					hideInfo();
				});
   			}
   		})
     });

     $("#audit_renew").click(function()
     {        
       if(!checkRole("superuser",true))
		 	return;
       var e = audit_history.getSelectedRow();
       if(e.row_data==null)
			return;  

	    showAsk(trad("Do you really want to renew the audit with selected data ?"),
   		function(res)
   		{
   			if(res == "validate")
   			{
   				showInfo(trad("Work in progress"));
    	
				var history_id = e.row_data[0].v;

                $.get("/?mod=audit&fct=renew_audit&session_id="+session_id+"&id="+history_id,							
                function (res)
                {
                	if(res!="ok")
					{
						hideInfo(trad(res));
						return;
					}
					
                    audit_history.reload();
                    hideInfo();
                });   	
   			}
   		})

     });

	 // afficher l'alert dans une infobulle
     function auditAlert(value)
     {
     	if(value==null)
     		return "";
     	 return "<span class='audit_alert fa fa-exclamation-circle fa-2x' data-toggle='tooltip' title='"+value+"'></span>";
	
     }

	 var audit_alert_prev_index =0;
     function auditClick(e)
     {
     	$("#audit_report tr").removeClass("audit_find_selected");
              
        var td = getElement(e.target,"td");
        var id= td[0].id.replace("audit_alert_","");
        var tr = td.parent();
        $("#audit_report td").removeClass("audit_alert_selected");
        if(id=="")
        {
        	// cherche la 1er alerte sur la ligne
        	var tds = tr.find("td");
        	
        	for(var i=0;i<tds.length;i++)
        	{
        		audit_alert_prev_index = audit_alert_prev_index % tds.length;
        		td = tds[audit_alert_prev_index++];
        		
        		if(td.id != "")
        		{        			
        			id= td.id.replace("audit_alert_","");
        			$(td).addClass("audit_alert_selected");
        			break;
        		}
        	}
        }
        else
        {
        	audit_alert_prev_id = 0;
        	td.addClass("audit_alert_selected");
        }
        audit_alert.selectFirstTr(0,id);
       	
        tr.addClass("audit_find_selected");

     }

     var par_id ;
     var list_boards = null;
     var ordered_boards = null;
	 
     function formatParagraph(data,deep)
     {
     
     	var res = "";
     	data.forEach(function(paragraph,i)
		{
			if(paragraph.title!=null)
			{
				res+="<h"+deep+" id='audit_par_"+(par_id++)+"'>"+paragraph.title+"</h"+deep+">";
			}
			else if(paragraph.comment!=null)
			{		
				
				res+="<textarea id='audit_textarea_"+paragraph.comment.id+"'>"+
				(paragraph.comment.text==null?"":paragraph.comment.text)+"</textarea>";

				res+="<pre class='audit_comment' id='audit_comment_"+paragraph.comment.id+"'>"+
				(paragraph.comment.text==null?"":replaceAll(paragraph.comment.text,"\n","<br/>"))+"</pre>";
			}
			else if(paragraph.board!=null)
			{
				if(typeof paragraph.board == "string")
				{
					list_boards.forEach(function(board,i)
					{		
						if(board.name == paragraph.board)
						{
							res+=formatBoard(board);
							ordered_boards.push(board);
						}
					});
				}
				else
				{
					res+=formatBoard(paragraph.board);				

				}

			}
			else if(paragraph!=null)
			 	res +=formatParagraph(paragraph,deep+1);
		});
		return res;
     }

     function formatBoard(board)
     {
			var res="";

			if(board.error!=null)
			{
				res+="<pre class='audit_alert'> Query for "+board.name+" failed !</pre><br/>";
			}
			else
			{
				res+="<table class='audit_board audit_table' id='audit_board_"+board.name+"'><tr class='header'>";

				board.headers.forEach(function(header,i)
				{
					res+="<th>"+header+"</th>";
				});
				res+="</tr>";

				board.rows.forEach(function(values,i)
				{
					// si la 1er colonne est non vide il y a une modif

					if(values[0].v!=null && values[0].v!="")
						res+="<tr class='data audit'>";
					else if(values[0].v!=null)
						res+="<tr class='data'>";
					else
						res+="<tr class='static' >";
											
					values.forEach(function(col,i)
					{
						if(typeof col == "string")
						{
							res+="<td>"+col+"</td>";
						}
						else
						{
							// col.id contient l'id de l'alert s'il y en a une
							var id=col.id==null?"":(" class='audit_alert_pos' id='audit_alert_"+col.id+"' ");

							if(i==0)
							{
								var icon=null;
								var classe="";
								switch(col.v)
								{
									case "modify":
										icon="fa-pencil-square";
										break;
									case "add":
										icon="fa-plus-square";
										classe="audit2";
										break;
									case "delete":
										icon="fa-minus-square";
										classe="audit1";
										break;							
								}
								if(icon==null)
									res+="<td>"+auditAlert(col.e)+"</td>";
								else
									res+='<td class="'+classe+'"><span class=" fa '+icon+' fa-2x">'+auditAlert(col.e)+'</span></td>';									  

							}
							else if(col.o!=null)
								res+="<td"+id+"><div class='audit2'>"+col.v+auditAlert(col.e)+"</div><div class='audit1'>"+col.o+auditAlert(col.oe)+"</div></td>";						
							else
								res+="<td"+id+">"+col.v+auditAlert(col.e)+"</td>";
						}
					});
					res+="</tr>";
				});
				res+="</table>";
			}	

			return res;	
     }

	// format les données du rapport
	function formatReport(data)
	{
				  		  
  		ordered_boards = null;
		if(data.error !=null)
		{
			return data.error;
		}
		
		par_id = 1;
		list_boards = data.boards;
	
		ordered_boards = [];
		return formatParagraph(data.doc,2);
		
	}

	

}
