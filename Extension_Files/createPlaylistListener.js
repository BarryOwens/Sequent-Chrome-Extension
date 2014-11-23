function clickPlaylistCreate(e) {  
if(e.target.id=="createPlaylist")
	{
		var localURLs = new Array();
		// The Below code searches the page for YouTube links
		chrome.tabs.executeScript(null,  {code:""
		+"var bodyContent = document.body.innerHTML; "
		+"var count = 0;"
		+"var regResult = false;"
		+"var videoIDs = new Array(); "
		+"var ytIDPattern = new RegExp('^(www\\\\.youtube\\\\\.com/watch\\\\?v\\\\=)([a-zA-Z0-9-_]{11})$');"
		+"doSearch(bodyContent,'');"
		+"function doSearch(searchString, previousLink)"
		+"{ "
				+"var linkPos = searchString.search('www.youtube.com/watch?'); "
				+"if(linkPos!=-1) "
				+"{"
					+"var linkFound = searchString.substring(linkPos,linkPos+35);"
					+"regResult = ytIDPattern.test(linkFound);"
					+"if(linkFound != previousLink && regResult==true)"
					+"{"
						+"console.log('pushed '+linkFound);"
						+"videoIDs.push(linkFound);"
					+"}"					
					+"count++;"
					+"var newSearchString = searchString.substring(linkPos+35,searchString.length);"
				+"doSearch(newSearchString, linkFound);"
				+"}"			
		+"}"
		+"videoIDs;"
		}, function(result){
			if(result[0].length == 0 || result == null)
			{
				$("#error_text").show();
			}
			else {
				//alert(' These are the links found ' +result[0]);		
				// Create a new tab where player will use links found
				chrome.tabs.create({'url':"http://www.barryowens.net/sequent/player.html?LinksFound="+result[0]}, function(tab)
				{
					chrome.tabs.sendRequest(tab.id, {
											'action' : 'TransferURLS',										
											});
				});// End crome.tabs.create
		    } // End else
		});	// end function(result)
	}	
}

document.addEventListener('DOMContentLoaded', function () {
  var createButton = document.getElementById('createPlaylist');
    createButton.addEventListener('click', clickPlaylistCreate);
});