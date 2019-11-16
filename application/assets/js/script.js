
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

	var request_url;


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
	pos_focus = 0;

}

showFinder()

function showMain()
{
	pos_focus = 0;
	$("div#finder").css("display","none")
	$("div#main").css("display","block")
	$("div#main input").focus();
	setTimeout(
	  function() 
	  {
	    	window_stat = "main"

	  }, 1000);

	
}

function newsearch()
{
	$("form").show()
	$("form input").focus()
	$("div#result").empty()
	pos_focus = 0
	$("div#bottom-bar div#button-right").text(pos_focus+" / "+items-1)


}



////////////////////////
//NAVIGATION
/////////////////////////



	function nav (move) {


		if(move == "+1")
		{
			pos_focus++


			if(pos_focus <= items)
			{

				$('li[tabindex='+pos_focus+']').focus()
				$('article[tabindex='+pos_focus+']').focus()
				
   
			    $('html, body').animate({
			        scrollTop: $(':focus').offset().top + 'px'
			    }, 'fast');

			}	

			if(pos_focus > items)
			{
				pos_focus = 0;
				$('li[tabindex=0]').focus()
				$('article[tabindex=0]').focus()
			}


		}

		if(move == "-1")
		{
			pos_focus--
			if( pos_focus >= 0)
			{
				
				$('li[tabindex='+pos_focus+']').focus()
				$('article[tabindex='+pos_focus+']').focus()

				$('html, body').animate({
				scrollTop: $(':focus').offset().top + 'px'
				}, 'fast');

			}

			if(pos_focus == -1)
			{
				pos_focus = items;
				
				$('li[tabindex='+pos_focus+']').focus()

			}
		}

		//$("div#bottom-bar div#button-right").text(pos_focus+" / "+items)

	}



function set_tabindex()
{
		items = $('div#finder ul > li').length-1;
		for(var i =0; i < items; i++)
		{
			$(items[i]).attr('tabindex',i) 
			pos_focus = 0
			$('div#finder ul').find('li[tabindex=0]').focus();
		}

}



////////////////////
////select/////
///////////////////

function select_language()
{
	if(window_stat == "finder")
	{
		var selected_button = $(":focus")[0];
		lang = selected_button.getAttribute('data-lang');
		showMain();
	}
	
}




$('#search').autocomplete({
    //lookup: countries,
    serviceUrl: 'https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json',
    minChars:1,
    triggerSelectOnValidInput: false,
    lookupLimit: 5,
    onSearchStart: function()
    {
    	//alert("search start")
    },
    onSearchError: function (query, jqXHR, textStatus, errorThrown) 
    {
    	//alert(textStatus)
    },
    onSelect: function (suggestion) {
        //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    }
});



///////////////////
//AJAX REQUESTS///
/////////////////

function sendRequest(search_term,request_source)
{
	if(window_stat == "main")
	{  
		if(request_source == "search")
		{
			request_url = "https://"+lang+".wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch="+search_term

		}

		if(request_source == "article")
		{
			request_url = "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&pageids="+search_term+"&prop=extracts&exlimit=max&explaintext&exintro"

		}

		$("div#result").empty()
 
		var xhttp = new XMLHttpRequest({ mozSystem: true });

		xhttp.open('GET',request_url,true);
		xhttp.withCredentials = true;
		
		xhttp.onload = function () 
		{
			
			if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) 
			{
				var data = xhttp.response;
				var obj = jQuery.parseJSON(data);
				
				if(request_source == "search")
				{

					if(obj.query.searchinfo.totalhits == 0)
					{
						var article = "<article id='noresults'>no results</article>";
						$("div#result").append(article);
						return false;

					}
					var k = -1;
					$.each(obj.query.search, function(i, item) {
						k++
						var article = "<article data-id="+item.pageid+" tabindex="+k+"><h1>"+item.title+"</h1><div class='snippet'>"+item.snippet+"</div></article>"
						$("div#result").append(article);

						$("div#main input").blur();
						$('div#main div#result').find("article:first").focus()


						items = $("div#result article").length-1
						pos_focus = 0
						$("form").hide()

						//$("div#bottom-bar div#button-right").text(pos_focus+" / "+items)

					
					 });

				}

				if(request_source == "article")
				{
					var k = -1;
					$.each(obj.query.pages, function(i, item) {
						k++
									
						var article = "<article><h1>"+item.title+"</h1><div class='snippet'>"+item.extract+"</div></article>"
						$("div#result").append(article);

						$("div#main input").blur();
						$('div#main div#result').find("article:first").focus()
						window_stat = "article"
		
					 });		
						
				}

		}

			

		if (xhttp.status === 404) 
		{
			alert("Url not found");
		}

		////Redirection
		if (xhttp.status === 301) 
		{
		
		}

	};



	xhttp.onerror = function () 
	{

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
			if($("input").is(":focus"))
			{
				sendRequest($("form input").val(),"search");
			}
			if($("article").is(":focus"))
			{
				sendRequest($(":focus").data("id"),"article");

			}
			evt.preventDefault();

		break;

		case 'Backspace':
		if(window_stat == "main" || window_stat == "finder")
		{
			window.close()
		}
		
		if(window_stat == "article")
		{
			window_stat = "main"
			sendRequest($("form input").val(),"search");
		}

		evt.preventDefault();
		break; 

		case 'SoftLeft':
			newsearch()
		break; 

		case 'SoftRight':
			
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

