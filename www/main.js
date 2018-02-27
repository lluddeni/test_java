var session_id;
var urlParams;
var lang = "en";
var client;
var user_role;
var version="0.0.0";

$(function () {

     $.fn.extend({
      tooltip:function()
      {
        this.each(function(i)
        {
          var title = $(this).attr("title");
          $(this).attr("title","");
          $(this).data("original-title",title);
          $(this).hover(
                function()
                {
                 
                  $("#tooltip .tooltip_arrow").hide();
                  $("#tooltip").show();
                  var pos = $(this).offset();
                  $("#tooltip span").text($(this).data("original-title"));

                  var ttsz = {w:$("#tooltip span").width(),h:$("#tooltip span").height()};
                  var elsz = {w:$(this).width(),h:$(this).height()};
                  var elpos = $(this).offset();
                  var ttpos = {left:pos.left - ttsz.w/2+elsz.w/2 };
                  var ardy=0;
                  if(pos.top<50)
                  {
                    ttpos.top = pos.top + elsz.h+15;
                    ardy=-20;
                    $("#tooltip_arrow_up").show();
                   
                  }                  
                  else
                  {
                    ttpos.top = pos.top - ttsz.h-20;
                    $("#tooltip_arrow_down").show();
                    ardy=ttsz.h+10;
                  }

                 
                  var htmlw = $('html').width();
                  if(ttpos.left<10)
                  {              
                      ardx = ttpos.left-10;
                      ttpos.left=10;
                  }
                  else if(ttpos.left+ttsz.w+10>htmlw)
                  {                     
                      ttpos.left=htmlw - ttsz.w-10;
                  }
                 
                  $(".tooltip_arrow").css({left:(elsz.w/2-5+(elpos.left-ttpos.left))+"px",top:ardy+"px"});
                  $("#tooltip").offset(ttpos);
                 
                 // alert();
                },
                function()
                {
                  $("#tooltip").hide();
                });
        });
      }
    });

  getUrlParams();
  var panels=[];
  var init_panel = 0;
  client = urlParams["client"] || "";
  lang = urlParams["lang"] || lang;

 

  $("#main_logout").click(function()
  {
    $("#logins_modal").show();
  });

 
  initPanel("inventory", "content_panel");
  initPanel("reviewlite", "content_panel");
  initPanel("audit", "content_panel");
  initPanel("admin", "content_panel");


  function endInitPanel()
  {
    $('[data-toggle="tooltip"]').tooltip();

  
    $('tbody').on('click','tr',function()
	{ 

		$(this.parentElement).children('tr').removeClass('selected');
		$(this).addClass('selected');
	});
	
	$.get("/?mod=system&fct=version",function(res)
    {
       version = res;
       $("#main_version").data("original-title","V"+res);
    });
    window.onresize = resize;
   //autologin
    if(client == null)      
       $("#logins_modal").show();   
    else
      $.get("/?mod=system&fct=check_client&client="+client,
      function(res)
      {
        $('.dataTables_filter').addClass('trad');

        if(lang=="en")
           endInit(res);
        else
        {
         // traduction des elements qui on la class trad
          var all_trads =[];
          $(".trad").each(function(index,elem)
          {
             var text =$(elem).text().trim();            
             var re = new RegExp('\"', 'g');
             var key = text.replace(re, '').toLowerCase();
    
             var inner = elem.innerHTML;
             var fr = html_trads[key];
             if(fr!=null && fr!="")     
                elem.innerHTML = inner.replace(text,fr);  
             all_trads.push(key);
                       
           });

           //traduction des tooltips
           $('*[data-toggle="tooltip"]').each(function(index,elem)
           {
             var text=$(elem).data("original-title");
             if(text!=null && text!="")
             {
              //all_trads.push( changeInnerHTML(elem));
               var re = new RegExp('\"', 'g');
               var key = text.replace(re, '').toLowerCase();   
               var fr = html_trads[key];
               if(fr!=null  && fr!="")  
                    $(elem).data("original-title",fr);
                all_trads.push(key);         
             }
           });


           $.post("/?mod=system&fct=trad&src=html&type=text",JSON.stringify(all_trads));
          endInit(res);         
        }

       
      })
   
  }
  
  function endInit(res)
  {
    
      $(".modal_close").click(
      function()
      {
         $(this).parent().parent().parent().hide();
      });

      $(".modal_cancel,.modal_validate").click(function()
      {
           $(this).parent().parent().parent().parent().hide();
      });

    resize();
    if(res=="ok")
      {
        // le client existe, on se log en session anonyme (read only)
        $("#login_user").val("superadmin");
        $("#login_connect").trigger("click");
      }
      else
        $("#logins_modal").show();  
      
      $("body").show();
   
  }

  // la selection dans un menu fait apparaitre un panel
  $(".nav-item a").click(

    function () 
    {
      if(table.isEdited())
        return;
      $(".nav-item a").removeClass("nav-active");
      $(this).addClass("nav-active");
      showPanel($(this).data("target"));
      $("#panel_title").text($(this).find("span").text());
    })

    
 

  $("#login_connect").click(function () {
    var user = $("#login_user").val();
    var pass = $("#login_pass").val();
    showInfo(trad("Try to connect..."));
    $.ajax({
      type: "GET",
      url: "/?mod=system&fct=login&user=" + user + "&pass=" + pass + "&type=json&client="+client,
      data: "",
      success: function (data) 
      {

        if (data.result == "ko") 
        {
        
          hideInfo("bad login");
        }
        else
         {
             hideInfo();
             user_role = data.result.role;

            $("#main_user").text(user);
            $("#main_client").text(client);
            session_id = data.result.session_id;
            var hide_class = ".user, .superuser, .admin, .superadmin";
            var index = hide_class.indexOf(user_role)+data.result.role.length+1;
            var role_hide_class = hide_class.substr(index);

          
            $(hide_class).show();
            $(role_hide_class).hide();
        //  $.get("/?mod=inventory&fct=create_tables&session_id="+session_id);
            $("#logins_modal").hide();

        
           // selectionne le 1er panel
           table.endEdit();
           $(".nav-link[data-target='inventory']").trigger("click");
        }
      }
    }).fail(function()
    {
      hideInfo(trad("Server is unavailable"));
    })
  });

 
  var ping = false;
  var ping_fail = 0;
  setInterval(function () {
    if (session_id == null || ping == true)
      return;
    ping = true;
    $.ajax({
      type: "GET",
      url: "/?mod=system&fct=ping&session_id=" + session_id + "&type=text",
      data: "",
      success: function (data) {
        ping_fail = 0;
        if (data == "ko") 
        {         
          session_id = null;
          $(".modal").hide();
          $("#logins_modal").show();
        }
      }
    }).fail(function()
    {
      ping_fail++;
      if(ping_fail>=5)
      {
         $(".modal").hide();
         $("#logins_modal").show();
         ping_fail = 0;
      }
    }).always(function () {
      ping = false;
    })
  }, 2000);


  $("#_target").on("load", function () {
    if (formSubmitCallback != null) {
      callback = formSubmitCallback;
      formSubmitCallback = null;
      callback($("#_target").contents().text());
    }
   
  })

  

  function initPanel(id, main_panel) 
  {

    init_panel++;
    /* $.getScript("modules/"+id+"/"+id+".js",
   
       function(data, textStatus, jqxhr)
       {*/
    // charge un panel, lui attribut un id et le rend visible ou pas
    var panel = $("<div class='panel'>").
      appendTo($("#" + main_panel)).
      load("modules/" + id + "/" + id + ".html",
      function () 
      {
        panel[0].id = id;

        // appel la fonction d'initialisation du panel
      
        var o = new window["init_" + id]();
        panels[id] = o;
      
        init_panel --;
        if(init_panel<=0)
            endInitPanel();
      });
    //  });

  }

  function getUrlParameter(name) 
  {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function getUrlParams()
  {
      var match,
          pl     = /\+/g,  // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
          query  = window.location.search.substring(1);

      urlParams = {};
      while (match = search.exec(query))
         urlParams[decode(match[1])] = decode(match[2]);
  }

  function resize(e) 
  {
    var h = $("html").height();
    $("#content_panel").height(h-120);
  
    // ne redimenssione que les panels visibles
    $.each($(".panel"),function(index,panel)
    {
      if($(panel).css("visibility")=="visible")
      {

        $("#"+panel.id+" .panel").height(h-120);

        $.each($("#"+panel.id+" [bottom]"),function(i,o)
        {
          var p = $(o).parent();
          h = p.height();
          var b = parseInt($(o).attr("bottom"));
          var t = $(o).offset().top - p.offset().top;
          $(o).height(h - b - t);
        });

         $.each($("#"+panel.id+" [right]"),function(i,o)
        {
          var p = $(o).parent();
          var w = p.width();
          var l = $(o).position().left;          
          var r = parseInt($(o).attr("right"));
          w = w-l-r;         
          $(o).width(w);
        });

        var o = panels[panel.id];      
        if(o.tables!=null)    
        $.each(o.tables,function(index,table)
        {
            table.resize();
        });
      }
    });

   
   
    return;
    var h = $('html').height();
    var w = $('html').width();

    scaley = h / 1080;
    scalex = w / 1920;

    $('html').css('transform', 'scale(' + scalex + ',' + scaley + ')');


  }
  
 
  $("#main_info_ok").click(function()
  {
      
    hideInfo();
  });

  $("#main_info_validate").click(function()
  {
     hideInfo();
    if(main_info_callback!=null)
      main_info_callback("validate");
   
  });

  $("#main_info_cancel").click(function()
  {
     hideInfo();
    if(main_info_callback!=null)
      main_info_callback("cancel");
   
  });

  function showPanel(name) {
    var panel = $("#" + name);
    // cache tous les panel
 
    $(".panel").css("visibility", "hidden");
     $(".panel").hide();
    // montre le panel selectionné
    $(panel).show();
    $(panel).css("visibility", "visible");

   
    resize();

    panels[name].show();
  }
});

/*
compare le role requis par rapport au role de l'utilisateur loggé
**/
function checkRole(role,show_info)
{
  var roles = "user superuser admin superadmin";
  var ok = roles.indexOf(user_role)>= roles.indexOf(role);
  if(!ok && show_info)
    hideInfo(trad("Function not avaible for this user !"));
 
  return ok;
}

var main_info_callback;

function showAsk(text,callback)
{
 $("#main_info_content").empty();
  main_info_callback = callback;
  $("#main_info_ok").hide();
  $("#main_wait").hide();
  $("#main_info_validate_cancel").show();
  $("#main_info_text").text(text);
  $("#main_info").show();
  return $("#main_info_content");
}

function showInfo(text) {
  
  $("#main_info_content").empty();
  $("#main_info_ok").hide();
  $("#main_info_validate_cancel").hide();
  $("#main_wait").show();
  $("#main_info_text").text(text);
  $("#main_info").show();
  
}

var current_modal;
function hideInfo(text) 
{

  $("#main_info_validate").prop("disabled",false);
  $("#main_info_ok").hide();
  $("#main_info_validate_cancel").hide();
  $("#main_wait").hide();
  $("#main_info").show();
 
  if(text)
  {
    $("#main_info_content").empty();
    $("#main_info_text").text(text);
    $("#main_info_ok").show();

     // check for modal open
    var modal = $(".modal:visible:not(#main_info)");
    if(modal.length>0)   
    {
      current_modal= modal;
      current_modal.hide();   
    }
   
  }
  else
  {
    $("#main_info").hide();
      if(current_modal!=null)
      {
        current_modal.show();
        current_modal = null;
      }
  }
 
}



function submit(form, callback) {
  formSubmitCallback = callback;

  form.submit();

}

// click sur un icone fichier pour le dowloader
function download(file)
{
	window.open(file);
}

function formatTimeFromMinutes(minutes)
{
  var date = new Date(null);
  date.setSeconds(minutes*60); // specify value for SECONDS here
  return date.toISOString().substr(11, 5);
}

/*
traduction des chaines issu des js
*/
function trad(text)
{
  var key = text.toLowerCase();
  if(js_trads[key]==null)
  {
     js_trads[key] = text;
     var arr =[];
     arr.push(key);
     // informe le serveur que cette clef n'est pas defini
     $.post("/?mod=system&fct=trad&src=js&type=text",JSON.stringify(arr));
    return text;
  }
  return js_trads[key]==""?text:js_trads[key];
}


/*
affiche une fenetre modale et definie le titre
*/
function showModal(dialog,title)
{
  $(dialog).find(".modal_title").text(title);
  $(dialog).show();
}

/* renvoie le 1er element de type nodeName si precisé, depuis element*/
function getElement(element,nodeName)
{
  if(element == null)
    return $("");
  
  nodeName = nodeName==null?null:nodeName.toLowerCase();

  do
  {   
    if(nodeName==null || element.nodeName.toLowerCase() == nodeName)
      return $(element);
    element = element.parentElement;
    
  } while(element!=null)

   return $("");
}


function replaceAll(str, find, replace) 
{
    return str.replace(new RegExp(find, 'g'), replace);
}