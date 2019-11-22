
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
	var search_filter;

	var request_url;

	var current_lng = 0;
	var current_lat = 0;

	var last_lang;

//window_stat = main
//window_stat = page
//window_stat = language



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

///////////////////////
///get geolocation////
//////////////////////


function geoloc()
{

		var options = {
		enableHighAccuracy: true,
		timeout: 50000,
		maximumAge: 20000
		};

		function success(pos) 
		{
			var crd = pos.coords;

			current_lng = crd.longitude;
			current_lat = crd.latitude;

			current_lng = current_lng.toFixed(3)
			current_lat = current_lat.toFixed(3)
			
			request_url = "https://"+lang+".wikipedia.org/w/api.php?action=query&list=geosearch&gscoord="+current_lng+"|"+current_lat+"&gsradius=10000&gslimit=5&format=json"

		
		}

		function error(err) 
		{
			alert("Position not found"+err.code+":"+err.message);
		}

		navigator.geolocation.getCurrentPosition(success, error, options);
}

	



/////////////////////////////////////
//////////////////////////////////////


function showLanguage()
{
	$("div#finder").css("display","block")
	$("div#main").css("display","none")
	window_stat = "language"
	//set_tabindex()
	pos_focus = 0;
	$("form input#language-list").focus()

}


showLanguage()

	function getLastLang()
	{

		last_lang = localStorage.getItem("last_lang")
		$("form input#language-list").val(last_lang)
	}

	getLastLang()





	var ac_lang = $('#language-list').autocomplete({
    lookup: countries,
    minChars:1,
    triggerSelectOnValidInput: false,
    showNoSuggestionNotice: true,
    lookupLimit: 5,
    
    onSearchStart: function()
    {
    	//alert("search start")
    	
    },
    onSearchError: function (query, jqXHR, textStatus, errorThrown) 
    {
    	//alert(query)
    },
    onSelect: function (suggestion) {
      lang = suggestion.data;
      showMain()
      localStorage.setItem('last_lang',suggestion.value)
      $('#language-list').autocomplete('disable');
      geoloc()


    },

    onSearchComplete: function (query, suggestions) {
      
        //alert(query.length)
          

    }
});
		
	



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




////////////////////////
//NAVIGATION
/////////////////////////



	function nav (move) {

		if(window_stat == "main" || window_stat == "language")
		{
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
		}

	}





	var ac = [
	    { value: '/random', data: 'random' },
	    { value: '/geo', data: 'geo' }
	];

	$('#search').autocomplete({
	    lookup: ac,
	    minChars:1,
	    triggerSelectOnValidInput: false,
	    lookupLimit: 5,
	    onSearchStart: function()
	    {

	    },

	    onSearchError: function (query, jqXHR, textStatus, errorThrown) 
	    {
	    	//alert(textStatus)
	    },

		onSelect: function (suggestion) {

		if(suggestion.data == 'random')
		{
			sendRequest("","random");
		}

		if(suggestion.data == 'geo')
		{
			sendRequest("","geo");
		}



		}
	});



///////////////////
//AJAX REQUESTS///
/////////////////

function sendRequest(search_term,request_source)
{
	
		if(request_source == "search")
		{
			request_url = "https://"+lang+".wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch="+search_term

		}

		if(request_source == "article")
		{
			request_url = "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&pageids="+search_term+"&prop=extracts&exlimit=max&explaintext&exintro"

		}

		if(request_source == "random")
		{
			request_url = "https://"+lang+".wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=3"
		}

		if(request_source == "geo")
		{
			
			request_url = "https://"+lang+".wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord="+current_lat+"|"+current_lng+"&gsradius=10000&gslimit=5"
		}

 
		var xhttp = new XMLHttpRequest({ mozSystem: true });

		xhttp.open('GET',request_url,true);
		xhttp.withCredentials = true;

		//alert(request_url)
		xhttp.onload = function () 
		{
			
			if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) 
			{
				var data = xhttp.response;
				var obj = JSON.parse(data);
				
				if(request_source == "search")
				{
					$("div#result").empty()
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
						window_stat = "main"


					
					 });

				}



				if(request_source == "random")
				{

					
					var k = -1;
					$.each(obj.query.random, function(i, item) {
						k++
						var article = "<article data-id="+item.id+" tabindex="+k+"><h1>"+item.title+"</h1></article>"
						$("div#result").append(article);

						$("div#main input").blur();
						$('div#main div#result').find("article:first").focus()


						items = $("div#result article").length-1
						pos_focus = 0
						$("form").hide()
						window_stat = "main"


					
					 });

				}



				if(request_source == "geo")
				{

					
					var k = -1;
					$.each(obj.query.geosearch, function(i, item) {
						k++
						var article = "<article data-id="+item.pageid+" tabindex="+k+"><h1>"+item.title+"</h1><div>Distance: "+item.dist+" km</div></article>"
						$("div#result").append(article);

						$("div#main input").blur();
						$('div#main div#result').find("article:first").focus()


						items = $("div#result article").length-1
						pos_focus = 0
						$("form").hide()
						window_stat = "main"


					
					 });

				}



				if(request_source == "article")
				{
					var k = -1;
					$("div#article-page").css("display","block")
					$("div#result").css("display","none")
					$("div#article-page").empty()


					

					$.each(obj.query.pages, function(i, item) {
						k++
						
						var article = "<article><h1>"+item.title+"</h1><div class='snippet'>"+item.extract+"</div></article>"
						$("div#article-page").append(article);

						$("div#main input").blur();
						$('div#main div#article-page').find("article").focus()
						$(window).scrollTop(0);
						window_stat = "page"
						

					 });		
						
				}
			}
		}

			

		if (xhttp.status === 404) 
		{
			alert("Url not found");
		}

		////Redirection
		if (xhttp.status === 301) 
		{
			alert("redirection");
		}

	



	xhttp.onerror = function () 
	{

		alert("status: "+xhttp.status);
		
	};

	xhttp.send(null)
}







//////////////////////////
////KEYPAD TRIGGER////////////
/////////////////////////
function handleKeyDown(evt) 

{	

	switch (evt.key) 
	{
		case 'Enter':
			//select_language();
			if($("form#search-form input").is(":focus"))
			{
				var input_val = $("form#search-form input").val()

				if(input_val == "/random")
				{
					sendRequest("","random");
				}

				else if(input_val == "/geo")
				{
					sendRequest("","geo");
				}
				else
				{
					sendRequest(input_val,"search");
				}
			}

			if($("div#result article").is(":focus"))
			{
				sendRequest($(":focus").data("id"),"article");
			}

			
			evt.preventDefault();

		break;

		case 'Backspace':
		if(window_stat == "main" || window_stat == "language")
		{
			window.close()
		}
		
		if(window_stat == "page")
		{
			window_stat = "main"
			$("div#article-page").css("display","none")
			$("div#result").css("display","block")
			$(window).scrollTop(0);
			pos_focus = 0
			$('article[tabindex='+pos_focus+']').focus()

		}

		evt.preventDefault();
		break; 

		case 'SoftLeft':
			newsearch()
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

