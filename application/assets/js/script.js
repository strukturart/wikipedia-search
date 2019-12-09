"use strict";

$(document).ready(function() 
 {


	//Global lets
	let windowOpen = false;
	let i = 0;
	let z = -1;
	let finderNav_tabindex = -1;
	let app_list_filter_arr = [];
	let list_all = false;
	let debug = true;
	let page = 0;
	let pos_focus = 0
	let languages = [];
	let dir_level = 0;
	let window_stat;
	let items = 0;
	let lang;
	let search_filter;

	let request_url;

	let current_lng = 0;
	let current_lat = 0;

	let last_lang;

//window_stat = main
//window_stat = page
//window_stat = language



////////////////////
//NOTFICATION//////
//////////////////



function notify(param_title,param_text,param_silent) {

	  let options = {
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
     let notification = new Notification(param_title,options);

  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        let notification = new Notification(param_title,options);


      }
    });
  }

}

///////////////////////
///get geolocation////
//////////////////////

let geoloc_try =0;
function geoloc()
{
	if ("geolocation" in navigator) {

		let options = {
		enableHighAccuracy: true,
		timeout: 7000,
		maximumAge: 1000
		};


		$("div#toast").text("searching for your position");

  		$( "div#toast" ).animate({top: "0px"}, 2000, "linear", function() {});

		geoloc_try++



		function success(pos) 
		{
			let crd = pos.coords;

			current_lng = crd.longitude.toFixed(3);
			current_lat = crd.latitude.toFixed(3);
			$( "div#toast" ).animate({top: "-100px"}, 1000, "linear", function() {sendRequest("","geo")});

		}

		function error(err) 
		{

			$("div#toast").text("Position not found"+err.code+":"+err.message);

			$( "div#toast" ).animate({top: "0px"}, 1000, "linear", function() {


				$( "div#toast" ).delay(4000).animate({top: "-100px"}, 1000);


			});

			
			if(geoloc_try < 2)
			{
				geoloc()
			}


		}

		navigator.geolocation.getCurrentPosition(success, error, options);


		} 
	else 
	{
		$("div#toast").text("geolocation IS NOT available")
		$( "div#toast" ).animate({top: "0px"}, 1000, "linear", function() {


				$( "div#toast" ).delay(2000).animate({top: "-100px"}, 1000);


			});
	}
}

	



/////////////////////////////////////
//////////////////////////////////////


function showLanguage()
{
	$("div#finder").css("display","block")
	$("div#main").css("display","none")
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





	let ac_lang = $('#language-list').autocomplete({
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


    },

    onSearchComplete: function (query, suggestions) {          

    }
});
		
	



function showMain()
{
	pos_focus = 0;
	$("div#finder").css("display","none")
	$("div#main").css("display","block")
	$("div#result").empty()
	$("div#main input").focus();
	$("div#article-page").css("display","none")
	$("div#article-page").empty()
	
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
	showMain()
	pos_focus = 0
}



function set_tabindex()
{
		items = $('div#finder ul > li').length-1;
		for(let i =0; i < items; i++)
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





	let ac = [
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
			geoloc()
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
			request_url = "https://"+lang+".wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=5"
		}

		if(request_source == "geo")
		{
			
			request_url = "https://"+lang+".wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord="+current_lat+"|"+current_lng+"&gsradius=10000&gslimit=5"
		}

 
		let xhttp = new XMLHttpRequest({ mozSystem: true });

		xhttp.open('GET',request_url,true);
		xhttp.withCredentials = true;

		//alert(request_url)
		xhttp.onload = function () 
		{
			
			if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) 
			{
				let data = xhttp.response;
				let obj = JSON.parse(data);
				
				if(request_source == "search")
				{
					$("div#result").empty()
					if(obj.query.searchinfo.totalhits == 0)
					{
						let article = "<article id='noresults'>no results</article>";
						$("div#result").append(article);
						return false;

					}
					let k = -1;
					$.each(obj.query.search, function(i, item) {
						k++
						let article = "<article data-id="+item.pageid+" tabindex="+k+"><h1>"+item.title+"</h1><div class='snippet'>"+item.snippet+"</div></article>"
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

					
					let k = -1;
					$.each(obj.query.random, function(i, item) {
						k++
						let article = "<article data-id="+item.id+" tabindex="+k+"><h1>"+item.title+"</h1></article>"
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

					
					let k = -1;
					$.each(obj.query.geosearch, function(i, item) {
						k++
						let article = "<article data-id="+item.pageid+" tabindex="+k+"><h1>"+item.title+"</h1><div>Distance: "+item.dist+" m</div></article>"
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
					let k = -1;
					$("div#article-page").css("display","block")
					$("div#result").css("display","none")
					$("div#article-page").empty()


					

					$.each(obj.query.pages, function(i, item) {
						k++
						
						let article = "<article><h1>"+item.title+"</h1><div class='snippet'>"+item.extract+"</div></article>"
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
				let input_val = $("form#search-form input").val()

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
	let e = evt.originalEvent; // get the javascript event
	console.log("original event:", e);
	if (e.message) { 
	    alert("Error:\n\t" + e.message + "\nLine:\n\t" + e.lineno + "\nFile:\n\t" + e.filename);
	} else {
	    alert("Error:\n\t" + e.type + "\nElement:\n\t" + (e.srcElement || e.target));
	}
	});

}




});

