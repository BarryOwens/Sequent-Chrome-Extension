

  
function click(e) {  

if(e.target.id=="createPlaylist")
	{
		
		var localURLs = new Array();		
		chrome.tabs.executeScript(null,  {code:""
		+"var bodyContent = document.body.innerHTML; "
		+"var count = 0;"
		+"var videoIDs = new Array(); "
		+"doSearch(bodyContent,'');"
		+"function doSearch(searchString, previousLink)"
		+"{ "
				+"var linkPos = searchString.search('www.youtube.com/watch?'); "
				+"if(linkPos!=-1) "
				+"{"
					+"var linkFound = searchString.substring(linkPos,linkPos+35);"
					+"if(linkFound != previousLink)"
					+"{"
						+"console.log(count+'th link found at '+linkPos +' link found is:' +linkFound);"
						+"console.log(' id only is ' +linkFound.substring(25,linkFound.length));"
					//	+"videoIDs.push(linkFound.substring(25,linkFound.length));"
						+"videoIDs.push(linkFound);"

					+"}"					
					+"count++;"
					+"var newSearchString = searchString.substring(linkPos+35,searchString.length);"
				+"doSearch(newSearchString, linkFound);"
				+"}"			
		+"}"
		+"localStorage['SequentYoutubeLinks'] = JSON.stringify(videoIDs) ;"
		+"videoIDs;"
		}, function(result){
		localStorage['SequentYoutubeLinks'] = JSON.stringify(result[0]) ;
		alert(' this is the result ' +result[0]);
		//chrome.tabs.executeScript(null,  {code:"alert('"+result+"');" });
			
			// Join the character array up to make it a string			
			//var urlsString =  result[0].join(",");
			//Split the string using commas
			//localURLs = urlsString.split(",");		
			// Stringify URLs to save in local Storage
			//localStorage['YouTubeURLs'] = JSON.stringify(localURLs);
			
			// Create a new tab where player will use links found
			chrome.tabs.create({'url':"http://www.barryowens.net/sequent/player.html"}, function(tab)

			//chrome.tabs.create({'url':chrome.extension.getURL("playerHome.html")}, function(tab)
	{
		chrome.tabs.sendRequest(tab.id, {
										'action' : 'TransferURLS',
										'data' : result[0]
										});
		//chrome.tabs.executeScript(tab.id, {code: "console.log(\"inside bkgd\");"});
	});

		});		
	
	}
	
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[0].addEventListener('click', click);
  }
});