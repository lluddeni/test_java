
function table(selector,panel,options)
{
  
  table.tables[selector] = this;

  var to = this;
  if(panel!=null)
  {
    if(panel.tables == null)
      panel.tables = [];
    panel.tables.push(this);
  }

  /* resize du tableau */
  this.resize = function()
  {
   // resize container;
    var w = this.c.width();
    // si pas de taille on prend la taille des colonnes
    if(w==0)    
      this.c.width(this.table_width);  
    else if(w>this.table_width)      
    {
      // si la taille est superieure a celle des colonne on ajuste la derniere
      w = (this.col_width[this.col_count-1] +( w - this.table_width))+"px";      
      var css = {"min-width":w ,"max-width":w, "width":w}; 
      this.col_css_width[this.col_count-1] = css;
      $("#"+this.id+" .last").css(css);            
    }
    else if(w<this.table_width)
    {
      // on remet la taille initial de la dernier colonne
       w = this.col_width[this.col_count-1] +"px";
       var css = {"min-width":w ,"max-width":w, "width":w}; 
       this.col_css_width[this.col_count-1] = css;
       $("#"+this.id+" .last").css(css);  
    }
    w = this.c.width();

    var h = this.c.height();
      
    if(h==0)  
      this.c.height(400);         
    
    this.ch.width(w);
    this.ct.width(w);
  
    this.ct.height(h-this.th.height()-this.tc.height());
  }


  this.options = options || {};
 
 // recupere l'element table
  var t = $(selector);
  // parent de la table
  var p = t.parent();
  // detache le header
  var h = $(selector+" thead").detach();
  // detache la table  
  t.detach();
  // recupere l'id
  this.id = t[0].id;
  // cree le container et reutilsie l'id
  this.c = $("<div id='"+this.id+"'></div>").appendTo(p);
  var cl= t.attr("class");
  t.attr("class","");
  this.c.attr("class",(cl==null?"":cl+" ")+ "table_container");
  this.c.attr("bottom",t.attr("bottom"));
  t.attr("bottom",null);
  this.c.attr("right",t.attr("right"));
  t.attr("right",null);
  // change l'id de la table interne
  t[0].id = "table_"+this.id;
  to.attr = [];
  $.each(t[0].attributes, function() 
  {   
    if(this.specified)   
      to.attr[this.name]= this.value;    
  });

  // emplacement pour titre et search
  this.tc = $("<div class='table_top_container'></div>").appendTo(this.c);
  // cree la barre de titre si necessaire
  if(this.options.header!=null || t.attr("header")!=null)  
    this.tt = $("<div class='table_title'>"+trad(t.attr("header"))+"</div>").appendTo(this.tc);
 
  if(this.options.search!=null || t.attr("searchbox")!=null)  
  {
    $("<span class='table_search_title trad'>Search:</span>").appendTo(this.tc);  
    this.sr = $("<input class='table_search_input' type='text'/>").appendTo(this.tc);
  
    this.sr.on("keyup",
      function(e)
      {
          // recherche la chaine dans les colonnes
          var search = $(this).val().trim().toLowerCase();
          if(search == "")
          {             
             to.table.find("tr").show();
            return;
          }
          to.table.find("tr").removeClass("on");
          $.each(to.table.find("tr"),function(i,tr)
          {
            $.each($(tr).find("td"),function(i,td)
            {
                  var text = $(td).text().toLowerCase();

                  if(text.indexOf(search)>=0)                  
                    $(tr).addClass("on");
                  
            });
          });
          to.table.find($("tr.on")).show();
          to.table.find($("tr:not(.on)")).hide();
      });
  }
  

  // creer le container du header
  this.ch = $("<div class='table_header_container'></div>").appendTo(this.c);
  // cree le container de la table 
  this.ct = $("<div class='table_data_container'></div>").appendTo(this.c);
  // cree la table header
  this.th = $("<table></table>").appendTo(this.ch);

  //met la table initiale dans son container
  this.table =t.appendTo(this.ct);
  // met le header dans sa table 
  this.header = h.appendTo(this.th);

   // cree la zone d'erreure si necessaire
  if(this.options.error!=null || t.attr("error")!=null)  
    this.te = $("<div class='table_error'>"+trad(t.attr("error"))+"</div>").appendTo(this.ct);

  // calcul les dimension des colonne
  var th = this.header.find("th");
  this.col_count = th.length;

  var col_css_width=[];
  var col_width =[];
  var table_width = 0;
  var column=[];

  // parcours les colonne de l'entete pour recuperer les options
  $.each(th,function(i,o)
  {
    if($(o).attr("key")!=null)
    {
      if(to.options.keys==null)
          to.options.keys =[];
      to.options.keys.push(i);
    }

    var w = $(o).prop("width") || "100px";
  
    var css = {"min-width":w ,"max-width":w};
    if(w == 0)
      css.display="none";
    else
    {
      w = (parseInt(w.substr(0,w.length-2)));
      table_width+=w;
    }
  
    col_width.push(w);
    col_css_width.push(css);   
    var col ={width:w,css:css,edit:$(o).attr("no_edit")==null};
    col.field = $(o).attr("field");  
    column.push(col);

    if(th.length-1==i)    
    {
       /* ajuste la derniere colonne pour tenir compte de la barre de scroll*/      
        w = (w+1000)+"px";
        table_width+=19;
        css = {"min-width":w ,"max-width":w};          
    }
   
    $(o).css(css);  
  });
 
  this.col_width = col_width;
  this.col_css_width = col_css_width;
  this.table_width = table_width;
  this.column = column;

   // resize container;
  this.resize();

 
  // gestion scroll
  $("#"+this.id+" .table_data_container").on("scroll",function()
  {
      var x = $("#"+to.id+" .table_data_container").scrollLeft();
      $("#"+to.id+" .table_header_container").scrollLeft(x);
  })

  //gestion click

  $("#"+this.id+" .table_data_container").on("click","tr",function(event)
  {
      if(event.currentTarget!=event.target)
        return;
      if(table.isEdited())
        return;
      var e ={};
      e.target = event.currentTarget;
      e.tr = $(this);      
      e.row_td = e.tr.find("td");
      e.row_index = parseInt(e.tr.attr("r"));  
      e.to = to;  
      e.data = to.data;
      e.row_data = to.data[ e.row_index];           
      to.inner_click.call(to,e);
  });

  $("#"+this.id+" .table_data_container").on("dblclick","td",function(event)
  {
    if(table.isEdited())
      return;
    to.sr.val($(this).text());
    to.sr.trigger("keyup");
  });

  $(to.sr).on("dblclick",function(event)
  {
   
    to.sr.val("");
    to.sr.trigger("keyup");
  });
  
  $("#"+this.id+" .table_data_container").on("click","td",function(event)
  {
    
    var e ={};
    e.target = event.target;
    e.tr = $(this).parent();
    e.row_td = e.tr.find("td");
    e.td = $(this);
    e.row_index = parseInt(e.tr.attr("r"));
    e.col_index = e.td.attr("c");
    e.col_name = to.column[e.col_index].name;
    e.data = to.data;
    e.to = to;  
    e.row_data = to.data[ e.row_index];
    e.cell_data = to.data[ e.row_index][e.col_index];

    if(to.edit_index!=null)
    {
        if(to.edit_input!= null && to.edit_index == e.col_index)
          return;
        to.nextEdit(e.col_index);
        return;
    }
    if(table.isEdited())
      return ;

  
    to.inner_click.call(to,e);
  });

  /* fin d'edition de la table*/
  this.endEdit = function()
  {
      if(this.edit_index==null)
         return;
      if( this.edit_input!=null) 
      {    
          this.edit_input.remove();        
          this.edit_input = null;
      }
     
      this.edit_index = null;
      this.edit_key = null;

      // memorise la clef de la ligne ajouter
      
      if(this.data.length>this.row_count)
      {
        this.edit_key  = "_";
        var row_data = this.data[this.data.length-1];
        for(var i =0;i<this.col_count;i++)
        {
          var c = this.column[i];
          if(c.key)
            this.edit_key+=row_data[i].n+"_";
        }
      
      }
  }

  /* rentre en mode edition et definie un champ*/
  this.setEdit = function(index, value)
  {
     var e = this.getSelectedRow();
     if(this.edit_index!=null)
     {
       e.row_data[index].n=value;
       return this;
     }
    
     this.edit_index = index;
    
     for(var i=0;i<e.row_data.length;i++)
        e.row_data.n=e.row_data[i].v;
    
     e.row_data[index].n=value;

     return this;
  }
  /* affiche la prochaine cellule editable*/
  this.nextEdit = function(direction)
  {
    $(".table_edit").remove();
    if(this.column == null)
      return;
    var e = this.getSelectedRow();
    
    if(direction==null)
    {
      // 1er appel 
      this.edit_index = -1;     
      for(var i=0;i<e.row_data.length;i++)
        e.row_data[i].n=e.row_data[i].v;
      direction = "left";

     
    }
    else if(!isNaN(direction) )
    {
      // on selectionne une nouvelle cellule
      if(this.edit_input!=null)
      {
        // remet la valeur dans le cellule precedente
         var td = $(e.row_td[this.edit_index]);      
         var new_value =  this.edit_input.val();  
                                
         e.cell_data = e.row_data[this.edit_index];
         e.cell_data.n = new_value;
         td.html(inner_draw(e));
            
         if(new_value != e.row_data[this.edit_index].v)       
           td.addClass("table_edit_diff");       
         else
           td.removeClass("table_edit_diff");  
      }
       this.edit_index = direction;
    }

      //marque les champ non editable
     
      for(var i=0;i<this.col_count;i++)
      {
        e.col_index = i;
        e.cell_column = this.column[i];
        if(!this.inner_iscelleditable(e))        
            $(e.row_td[i]).addClass("table_no_edit");
        
        else 
         $(e.row_td[i]).removeClass("table_no_edit");
      }
   
    var count = this.column.length;
    this.edit_input  = null;
    while(count-->=0)
    {

        if(direction=="left")
        {
          this.edit_index++;
          if( this.edit_index >= this.column.length)
            this.edit_index=0;
        }
        else if(direction=="right")
        {
          this.edit_index--;
          if( this.edit_index <0 )
            this.edit_index=this.column.length-1;
        }
        else
          count = -1;

        e.td = $(e.row_td[this.edit_index]);  
      
        e.col_index = this.edit_index;
        e.cell_data = e.row_data[e.col_index];        
        e.cell_column = this.column[e.col_index];
        e.col_name = e.to.column[e.col_index].name;

        if(this.inner_iscelleditable(e))
        {
           e.td.text("");
           var select_value = null;
           if(e.cell_column.values !=null)
           {
               // valeur autorisé fourni               
               var edit_input = "<select class='table_edit'>";
                                       

               for(var i=0;i<e.cell_column.values.length;i++)
               {
                    var value = e.cell_column.values[i];
                    edit_input+="<option value='"+value+"' >"+value+"</option>";    
                   if(select_value == null)            
                      select_value = value;
                   else 
                      select_value = "";
                     
               }
                              
               edit_input +="</select>";
               this.edit_input = $(edit_input);

               this.edit_input.on("change",function()
               {
                  e.to.edit_check();
               });
           }
           else if(e.cell_column.type=="java.math.BigDecimal" || e.cell_column.type=="java.lang.Integer")
           {
              this.edit_input = $("<input class='table_edit' type='number'></input>");              
           }
           else if(e.cell_column.link==null)
           {
               // on remplie la liste de choix avec les valeurs de la colonne
               var edit_input = "<input list='edit_data_list' class='table_edit'><datalist id='edit_data_list'>";
               var values = [];

                
               for(var i=0;i<this.data.length;i++)
               {
                 // on prend que les valeurs des ligne visibles
                 if(!$("#"+to.id+" tr[r="+i+"]").hasClass("on"))
                    continue;
                 var value = this.data[i][e.col_index].v;
                 if(value!="" && values[value]==null)
                 {
                    edit_input+="<option value='"+value+"' >";
                    values[value] = true;
                 }
               }
               edit_input +="</datalist></input>";
              
               this.edit_input = $(edit_input);
               this.edit_input.on("change",function()
               {
                  e.to.edit_check();
               });
           }
           else 
           {
               // prend les valeur autorisé dans la table parent
               var edit_input = "<select class='table_edit'>";
               var values = [];
               // la colonne reference une autre table
               var link_table = table.getFromName(e.cell_column.link);
               var col_index = link_table.col_indexes[e.cell_column.name];

               // cherche les autres colonnes non vide referencant la même table
               var link_index = [];
               for(var i=0;i<e.col_index;i++)  
                 if(e.to.column[i].link==link_table.name)                 
                    link_index[link_table.col_indexes[e.to.column[i].name]] = e.row_data[i].n;;                                

               for(var i=0;i<link_table.data.length;i++)
               {
                 // filtre les valeurs d'apres les autres colonne lié a la meme table
                 var add_value = true;
                 for(var j in link_index)
                 {                   
                   var v = link_index[j];
                   if(v != link_table.data[i][j].v) 
                   {                  
                        add_value= false;                   
                        break;
                   }
                 }
                 if(!add_value)
                    continue;
                 var value = link_table.data[i][col_index].v;
                 if(value!="" && values[value]==null)
                 {
                    if(link_table.checkLinkValue({to:link_table,row_data:link_table.data[i]}))
                    {                    
                      edit_input+="<option value='"+value+"' >"+value+"</option>";
                      values[value] = true;
                      if(select_value == null)            
                        select_value = value;
                      else 
                        select_value = "";
                    }
                 }
                 
               }
               edit_input +="</select>";
               this.edit_input = $(edit_input);

               this.edit_input.on("change",function()
               {
                  e.to.edit_check();
               });
           }          
         
           this.edit_input.appendTo(e.td)
            .val(e.cell_data.n)           
            .on("keydown",function(event)
            {                       
                if(event.keyCode==9)
                {
                  event.preventDefault();   
                  $(this).trigger("blur");
                  e.to.nextEdit(event.shiftKey?"right":"left");
                }                
            })
            .on("keyup",function(event)
            {
                e.to.edit_check();
            })
            .on("blur",function(event)
            {                 
                  e.to.edit_check();
                
                  e.to.edit_input.remove(); 
                  e.to.edit_input = null;
                  e.td.html(inner_draw(e));   
                  if(e.cell_data.n != e.cell_data.v)       
                     e.td.addClass("table_edit_diff");       
                  else
                     e.td.removeClass("table_edit_diff");  
                              
            }).focus();

            e.to.edit_check();
            if(select_value!=null && select_value!="")
            {
              // il n'y a qu'une valeur selectionnable, on la selectionne  
              var option = $(this.edit_input.find("option")[0]); 
              if(e.cell_data.n != option.val())                 
                option.prop("selected","selected");            
              
            }
          break;    
        }
        
    }
  }

/* determine si une cellule est editable*/
 this.inner_iscelleditable = function(e)
 {
   return (e.cell_column.key==null || e.key =="_") && e.cell_column.edit && this.isCellEditable(e) ;
 }

 /* on verifie les données modifié */
 this.edit_check = function()
 {
    // verifie que la clef est rempli et n'apparait pas en double
     $("#"+this.id+" td").removeClass("table_error");

    var e = this.getSelectedRow();
  
    if(this.edit_input!=null)         
      e.row_data[this.edit_index].n=this.edit_input.val();
    e.col_index =this.edit_index;
    
    e.cell_column = this.column[e.col_index];
    e.col_name = e.cell_column.name;
    e.cell_data= e.row_data[this.edit_index];

    if(this.keys==null)
      return true;

    var key="_";
    var result = true;
    for(var i=0;i<this.keys.length;i++)
    {   
        var value =  e.row_data[this.keys[i]].n;
        if(value==null || value == "")
        {
           $(e.row_td[this.keys[i]]).addClass("table_error");
           result = false;
        }
        key+= value +"_";
    }     
   
    if(key != e.key)
    {
     
      if($("#"+this.id+" tr[k='"+key+"']").length>0)
      {
         for(var i=0;i<this.keys.length;i++)    
           $(e.row_td[this.keys[i]]).addClass("table_error");
         result = false;
      }
    }
    else 
      result=true;

    return this.editCheck(e,result) || result;

 
 }
  /* fonction click interne */
 this.inner_click = function(e)
 {
   console.log(this.id+".click("+e.row_index+","+e.col_index+","+e.cell_data+")");

   $(this.table).find("tr").removeClass("selected");
   $(e.tr).addClass("selected");
 
   // verifie si des cellules sont editable
   
   var count=0;
   for(var i=0;i<this.col_count;i++)
   {
     var ee ={};
     ee.to = to;       
     ee.cell_column = this.column[i];
     ee.key = e.key;
     ee.col_index = i;
     ee.row_data = e.row_data;
     ee.cell_data = e.row_data[i];
     if(this.inner_iscelleditable(ee))
        count++;
   }       
   

   this.click(e);
   // informe le script que la ligne est editabel ou pas
   this.isRowEditable(count==null || count>0);
 }

  /* a redefinir */
  this.isRowEditable = function(isEditable)
  {

  }

  /* remplace le titre */
  this.setTitle = function(title)
  {
    $("#"+this.id).find(".table_title").text(title);
  }

  /* filtre l'affichage celon une valeur de colonne*/
  this.filter = function(col,value)
  {
    this.options.filter={col:col,value:value};
    if(value == null )
    {             
       this.table.find("tr").hide();
       return;
    }
    if(value=="")
    {
       this.table.find("tr").show();
       return;
    }
   
    this.table.find("tr").removeClass("on");
    $.each(to.table.find("tr"),function(i,tr)
    {
      $.each($(tr).find("td"),function(i,td)
      {         
        var t = $(td).html();
         if($(td).attr("c")==col && t!="" && (t==value || value=="*"))                  
            $(tr).addClass("on");    
      });
    });
    this.table.find($("tr.on")).show();
    this.table.find($("tr:not(.on)")).hide();
  }

  /* recharge les données*/
  this.reload = function(callback)
  {
    if(this.url==null)
      return;
    this.load(this.url,callback);
  }

  /* charge les données */
  this.load = function(url,callback)
  {
    this.url = url;
    to.beforeLoad();

    $.ajax({
      type: "GET",
      url: url,
      data: "",
      success: function (result) 
      {
        // memorise le tr selectionné
        var prev_key = to.edit_key || $("#"+to.id+" tr.selected").attr("k");
        this.edit_key = null;
        to.name = result.name;
        to.links = result.links;
        to.table.empty();
        to.ct[0].scrollTop = 0;
        to.data = result.data || [];
        to.is_data = result.data!=null;
        to.row_count = 0;
        if(result.attr!=null)
        {
          for(var i=0;i<result.attr.length;i++)
          {
            var attr = result.attr[i];
            to.attr[attr.name] = attr.value;
          }
        }

      
        var keys = to.options.keys || [];
        to.col_indexes=[];
        if(result.columns!=null)
        {
          // verifie si on doit mappé des colonne (toute les colonnes doivent etre mappé dans ce cas)
           var map_column = [];
           for(var j=0;j<to.column.length;j++)
              if(to.column[j].field==null)
              {
                map_column = null;
                break;
              }
           
           var th =  to.header.find("th");
           for(var i=0;i<result.columns.length;i++)
           { 
              var result_col = result.columns[i];
              var index = i;
              if(map_column!=null)
              {
                for(var j=0;j<to.column.length;j++)
                {
                    var field = to.column[j].field;
                    if(field == result_col.name)
                    {
                      index = j;                
                      break;
                    }
                }
                map_column.push(index);
              }
              if(to.column[index] == null)
                to.column[index] ={};
              to.column[index].name = result_col.name;
              to.column[index].label = result_col.label;
              to.column[index].type = result_col.type;
              to.column[index].link = result_col.link;
              to.column[index].values = result_col.values;
              to.column[index].index = index;
              to.col_indexes[result_col.name] = index;
              if( result_col.key!=null)
              {
                  to.column[index].key = result_col.key;
                  if(keys.indexOf(index)<0)
                    keys.push(index);
              }    
              if(to.column[index].label!=null)                                    
              {
                  $(th[index]).text(to.column[index].label);
              }
           }
           if(map_column!=null)
           {
             // reordonne les colonne de resultat
             var data = [];
             for(var i=0;i<to.data.length;i++)
             {
                var row = [];
                for(var j=0;j<map_column.length;j++)                                 
                   row[map_column[j]] = to.data[i][j];                                  
                data.push(row);
             }
             to.data = data;
           }
        }
        to.keys=keys;
     
        if( to.is_data)
        {
          if(to.te!=null)
              to.te.hide();
         

          var e ={};
          e.data = to.data;
          e.to = to;
          to.beforeDraw(e);
          for(e.row_index=0;e.row_index<to.data.length;e.row_index++)
          {
            to.row_count++;
            e.row_data = to.data[e.row_index];

            var key="_";
            for(var i=0;i<keys.length;i++)    
                 key+= e.row_data[keys[i]].v+"_";

            var tr = $("<tr k='"+key+"' r='"+e.row_index+"'></tr>").appendTo( to.table);
            for(e.col_index=0;e.col_index<to.col_count;e.col_index++)
            {                     
                e.cell_data =e.row_data[e.col_index] || {v:""};
               
                e.cell_column = to.column[e.col_index];                
                e.col_name = e.to.column[e.col_index].name;
                                 
                e.td =$("<td c='"+e.col_index+"'></td>").appendTo(tr).css(to.col_css_width[e.col_index]);
                e.td.html(inner_draw(e));
                
                if(e.col_index == to.col_count-1)
                  e.td.addClass("last");
            }
          }
          var tr_selected = null;
          if(prev_key!=null && prev_key!="_")
          {
            tr_selected =  $("#"+to.id+" tr[k='"+prev_key+"']");
            tr_selected.addClass("selected");
          }
          else if(to.options.clickfirst!=null || to.table.attr("clickfirst")!=null)
          {
            tr_selected = $($(to.table).find("tr")[0]);
          }
          $("#"+to.id +" [data-toggle='tooltip']").tooltip();

          if(to.options.filter!=null || to.table.attr("filter")!=null)
          {     
              to.options.filter = to.options.filter||{};
              to.filter(to.options.filter.col,to.options.filter.value);
          }

          to.offset_tr=[];

          $("#"+to.id+" tr").each(function(index)
          {
            to.offset_tr.push($(this).offset().top);
           });

          if(tr_selected!=null && tr_selected.length>0)
          {
            // assure la visibilité de la ligne
            to.checkSelectedRowVisibility(tr_selected);         
            tr_selected.click();
          }
        }
        else
        {
          // pas de données recu -> affiché une erreure
          if(to.te!=null)
              to.te.show();         
        }

        if(to.sr!=null)
          to.sr.trigger("keyup");
        
        to.afterLoad();

        if(callback)
          callback(to);     
      }
    })
  };

  /* ajoute une ligne vide */
  this.addRowEdit = function()
  {
     this.unselect();

     var e ={};
     e.data = this.data;
     e.to = this;
     e.row_index = this.data.length;
     e.row_data = [];
     this.data.push(e.row_data);
   
    for(var i=0;i<this.col_count;i++)    
        e.row_data.push({v:""});
   
    var tr = $("<tr class='selected add' k='_' r='"+e.row_index+"'></tr>").appendTo( this.table);

    for(var i=0;i<this.col_count;i++)  
    {                     
        e.cell_data =e.row_data[i];
        e.col_index=i;

        if(this.column!=null)
          e.cell_column = this.column[i];                

        var td =$("<td c='"+e.col_index+"'>"+inner_draw(e)+"</td>").appendTo(tr).css(this.col_css_width[e.col_index]);

        if(e.col_index == to.col_count-1)
          td.addClass("last");
    }
     
     this.nextEdit();

  }
  /* renvoie le contenu formaté d'une cellule*/
  function inner_draw(e)
  {
      var draw =e.to.draw(e) ;
      if(draw!=null)
        return draw;
      
     
      if(e.cell_data.n!=null && e.cell_data.v!=e.cell_data.n)
        return "<div class='table_diff'>"+ e.cell_data.n +"</div>"+
              (e.cell_data.o!=null?"<div>"+  e.cell_data.o+"</div>":"");
    
      if(e.cell_data.o==null)
      {
          if(e.cell_data.v==null || e.cell_data.v=="" )
            return "";
         return e.cell_data.v;
      }

      return "<div class='table_diff'>"+ (e.cell_data.v==""?"-":e.cell_data.v) +"</div>"+
              (e.cell_data.o!=null?"<div>"+  e.cell_data.o+"</div>":"");
       
  }
 
  /* renvoie les données du tr selectionné */
  this.getSelectedRow = function()
  {
    var e = {};  
    e.to = this;
    e.tr = $("#"+this.id+" tr.selected");
    if(e.tr.length>0)
    {
      e.row_index = parseInt(e.tr.attr("r"));
      e.row_data = this.data[e.row_index]; 
    }
    e.row_td = e.tr.find("td");
    e.key = e.tr.attr("k");
   
   
    return e;
  };



  /* renvoie la ligne de données au format json avec nom de colonne
     appelé par un objet e issue de getSelectedRow */
 this.getSelectedJSONRow=function()
 {
    var e = this.getSelectedRow();
   
    var r = {};

    for(var col_index=0; col_index<this.col_count; col_index++)               
        r[this.column[col_index].name]=e.row_data[col_index].n!=null?e.row_data[col_index].n:e.row_data[col_index].v;
                         
    return r;
 }

   /* assure la visibilité de la ligne selectionné*/
  this.checkSelectedRowVisibility = function(tr_selected)
  {
    if(tr_selected==null || tr_selected.length==0)
      return;
     
    var ct_top =  this.ct.offset().top;
    var top = this.offset_tr[tr_selected.attr("r")] ;
    var scrollTop = this.ct[0].scrollTop;
    if(top<ct_top+scrollTop)            
        this.ct[0].scrollTop =  top - ct_top  ;
    else 
    {
      var bottom = top + tr_selected.height();
      var ct_bottom =  ct_top + this.ct.height() ;
      if(bottom>ct_bottom+scrollTop)
          this.ct[0].scrollTop = bottom - ct_top;
    }

  }

  /* selection la row qui contient what dans la col*/
  this.selectFirstTr = function(col,what)
  {
     var tr = getElement(this.findFirstTd(col,what)[0],"tr");
     $(this.table).find("tr").removeClass("selected");
     $(tr).addClass("selected");

     this.checkSelectedRowVisibility($(tr));    
  }

  /* deselection la ligne selectionné*/
  this.unselect = function()
  {
    $("#"+this.id+" tr.selected").removeClass("selected");
  }

  /* met a jour la celule du tr selectionné*/
  this.updateCell = function(col,value)
  {
      if(isNaN(col))
        col = this.col_indexes[col];

      var e ={col_index:col,data:this.data};
      var tr = $("#"+this.id+" tr.selected");
      e.row_index = parseInt(tr.attr("r"));
      
      if(e.row_index==null)
        return;
        
      e.row_data = e.data[e.row_index];
      e.cell_data.v =value;
      e.row_data[col] = value;
      var draw =this.draw(e) || e.cell_data.v || "";
      $(tr.find("td")[col]).html(draw);
      
  }
  
  /* click sur la 1er ligne du tableau*/
  this.clickFirstRow = function()
  {
      $($(this.table).find("tr")[0]).trigger("click");
  }
  /* renvoie la ligne de data contenant la valeur what dans la colonne d'index col*/
  this.findFirstRow = function(col,what)
  {
     if(isNaN(col))
        col = this.col_indexes[col];

    for(var i =0 ;i<this.data.length;i++)
    {
      if(this.data[i][col].v==what)
        return this.data[i];
    }
    return null;
  }

  /* recherche le td qui contient what*/
  this.findFirstTd = function(col, what)
  {
      var rows = this.table.find("tr");

       if(what==null && col==null )
          return $($(rows[0]).find("td")[0]);

      if(isNaN(col))
        col = this.col_indexes[col];

      var isFunction = typeof what === "function";
      
      for(var r=0;r<rows.length;r++)
      { 
          var cols = $(rows[r]).find("td");
          var td = $(cols[col]);
          if(isFunction)
          {
            if(what(td.text()))
              return td;
          }
          else if(td.text() == what)
              return td;
                 
      }
       return $("");
  }
 
 /* efface les données du tableau et de la table*/
 this.clearData = function()
 {
   this.table.empty();
   this.data = [];
   this.row_count = 0;

 }

/*
  FONCTION A REDEFINIR DANS LES SCRIPTS
*/


/* verifie aupres du parent si une valeur de liste enfant est valide*/
this.checkLinkValue = function(e)
{
 return true;
}

this.isCellEditable = function(e)
{
  return true;
}
/*appelé apres edition d'une celulle*/
 this.editCheck=function(result)
 {

 }

/* appellé apres click*/
 this.click = function(e)
 {
 }

 /* function draw a redefinir */
  this.draw = function(e)  
  {      
  }

  /* appellé avant le dessin du tableau pour modifier les données*/
  this.beforeDraw = function(e)
  {
  }

   /* appellé avant le load des données*/
  this.beforeLoad = function()
  {
  }
 /* appellé aprés le load des données*/
  this.afterLoad = function()
  {
  }


}
table.tables=[];

/* renvoie la table selectionné en focntion du selectore (ex: #table)*/
table.select = function(selector)
{
  if(selector!=null)
    table.selector = selector;
  return table.tables[table.selector];
}

/* renvoie la table en fonction de son nom*/
table.getFromName = function(name)
{
  for(var seletor in table.tables)
    if(table.tables[seletor].name == name)
      return table.tables[seletor];
  return null;
}

/* renvoie true si une edition est en cours*/
table.isEdited = function()
{
  var t = table.select();
  return (t!=null && t.edit_index!=null) ;
}

/* termine l'edition de la table selectionné */
table.endEdit = function()
{
  var t = table.select();
  if(t!=null)
    t.endEdit();
}
