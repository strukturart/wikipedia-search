
$(document).ready(function() 
 {


	//Global Vars
	var windowOpen = false;
	var i = 0;
	var z = -1;
	var finderNav_tabindex = -1;
	var app_list_filter_arr = [];
	var list_all = false;
	var debug = false;
	var page = 0;
	var pos_focus = 0
	var languages = [];
	var dir_level = 0;
	var window_stat;
	var items = 0;
	var lang;

	var api_url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch="



////////////////////
//NOTFICATION//////
//////////////////



function notify(param_title,param_text,param_silent) {

	  var options = {
      body: param_text,
      silent: param_silent
  }
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
     var notification = new Notification(param_title,options);

  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(param_title,options);


      }
    });
  }

}





function showFinder()
{
	$("div#finder").css("display","block")
	$("div#main").css("display","none")
	window_stat = "finder"
	set_tabindex()

}

showFinder()

function showMain()
{
	
	$("div#finder").css("display","none")
	$("div#main").css("display","block")
	window_stat = "main"
	$("div#main input").focus();
	
}

function newsearch()
{
	$("form input").focus()
	$("div#result").empty()
}



////////////////////////
//NAVIGATION
/////////////////////////



	function nav (move) {

		
		if(move == "+1")
		{
			pos_focus++


			if(pos_focus <= items.length)
			{

				$('li[tabindex='+pos_focus+']').focus()
			}	

			if( pos_focus == items.length)
			{
				pos_focus = 0;
				$('li[tabindex=0]').focus()

				  
			}


		}

		if(move == "-1")
		{
			pos_focus--
			if( pos_focus >= 0)
			{
				
				$('li[tabindex='+pos_focus+']').focus()

			}

			if(pos_focus == -1)
			{
				pos_focus = items.length-1;
				
				$('li[tabindex='+pos_focus+']').focus()

			}
		}


	}



function set_tabindex()
{
		items = $('div#finder ul > li');
		for(var i =0; i < items.length; i++)
		{
			$(items[i]).attr('tabindex',i) 
			pos_focus = 0
			$('div#finder ul').find('li[tabindex=0]').focus();
		}

}













////////////////////
////GEOLOCATION/////
///////////////////

function select_language()
{
	if(window_stat == "finder")
	{
	

	var selected_button = $(":focus")[0];
	lang = selected_button.getAttribute('data-lang');
	//alert(lang)

	api_url = "https://"+lang+".wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch="

	showMain();
	}
	


	
}






function sendRequest(search_term)
{
	if(window_stat == "main")
	{  

		$("div#result").empty()
 


	

		var xhttp = new XMLHttpRequest({ mozSystem: true });

		xhttp.open('GET',api_url+search_term,true)
		xhttp.withCredentials = true;
		





		xhttp.onload = function () {
			
			if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) 
			{
				
				var data = xhttp.response;

				var obj = jQuery.parseJSON(data);

				$.each(obj.query.search, function(i, item) {

					$("div#result").append("<article>");
				    $("div#result").append("<h1>"+item.title+"</h1>");
				     $("div#result").append("<div class='snippet'>"+item.snippet+"</div>");
				     $("div#result").append("</article>");
				     $("div#result:first-child").focus()
				     $("div#main input").blur();
					
				});
				$("form input").val("")
				

			}

			if (xhttp.status === 404) 
			{
				alert("Url not found");
			}

			////Redirection
			if (xhttp.status === 301) 
			{
				if(param_redirect != true)
				{
				
				}

				if(param_redirect == true)
				{
				
					
				}
			}




	};



	xhttp.onerror = function () {
	alert("status: "+xhttp.status);
		
	};

	xhttp.send(null)
}


}




	//////////////////////////
	////KEYPAD TRIGGER////////////
	/////////////////////////
function handleKeyDown(evt) 

{	

	switch (evt.key) 
	{
		case 'Enter':
			select_language();
			sendRequest($("form input").val());
			evt.preventDefault();

		break;

		case 'Backspace':
		
		
		break; 

		case 'SoftLeft':
			newsearch()
		break; 

		case 'SoftRight':
			showFinder()
		break; 


		

		case 'ArrowDown':
			nav("+1")
		break; 

		case 'ArrowUp':
			nav("-1")
		break; 

		

		

	}
}







	document.addEventListener('keydown', handleKeyDown);


	//////////////////////////
	////BUG OUTPUT////////////
	/////////////////////////

if(debug == true)
{
	$(window).on("error", function(evt) {

	console.log("jQuery error event:", evt);
	var e = evt.originalEvent; // get the javascript event
	console.log("original event:", e);
	if (e.message) { 
	    alert("Error:\n\t" + e.message + "\nLine:\n\t" + e.lineno + "\nFile:\n\t" + e.filename);
	} else {
	    alert("Error:\n\t" + e.type + "\nElement:\n\t" + (e.srcElement || e.target));
	}
	});

}




});

