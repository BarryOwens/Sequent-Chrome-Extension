function clickPlaylistCreate(e) {  
if(e.target.id=="createPlaylist")
	{
		alert(' im in');
		var localURLs = new Array();
		// The Below code searches the page for YouTube links
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
						+"videoIDs.push(linkFound);"
					+"}"					
					+"count++;"
					+"var newSearchString = searchString.substring(linkPos+35,searchString.length);"
				+"doSearch(newSearchString, linkFound);"
				+"}"			
		+"}"
		+"videoIDs;"
		}, function(result){
		alert(' this is the result ' +result[0]);		
			// Create a new tab where player will use links found
			chrome.tabs.create({'url':"http://www.barryowens.net/sequent/player.html?LinksFound="+result[0]}, function(tab)
			{
				chrome.tabs.sendRequest(tab.id, {
										'action' : 'TransferURLS',										
										});
			});
		});	
	}	
}

document.addEventListener('DOMContentLoaded', function () {
  var createButton = document.getElementById('createPlaylist');
    createButton.addEventListener('click', clickPlaylistCreate);
});