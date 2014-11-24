chrome.tabs.getSelected(null,function(tab) {
    var tablink = tab.url.toString();
	//alert(tablink);
	if(tablink.indexOf("facebook.com") > 1)
	{
		$("#how_to_text").show();
	}	
});
function clickPlaylistCreate(e) {  
if(e.target.id=="createPlaylist")
	{
		var localURLs = new Array();
		// The Below code searches the page for YouTube links
		chrome.tabs.executeScript(null, {file: "searchForLinks.js"},
		 function(result){
			if(result[0].length == 0 || result == null)
			{
				$("#error_text").show();
			}
			else {
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