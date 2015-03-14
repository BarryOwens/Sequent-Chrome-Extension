var bodyContent = document.body.innerHTML; 
var linkFound;
var regResult = false;
var videoIDs = new Array(); 
// Regex for YouTube links and YouTube IDs
var ytLinkPatt = new RegExp("(?:www\\.)?youtu(?:be\\.com/watch\\?v=|\\.be/)([\\w\-]*)(&(amp;)?[\\w\\?=]*)?");
var ytLinkPattEmbed = new RegExp("(?:www\\.)?youtu(?:be\\.com/embed/)([\\w\-]*)(&(amp;)?[\\w\\?=]*)?");// Checks for links like https://www.youtube.com/embed/0B0112bvG1s
var idPatt = new RegExp("^[a-zA-Z0-9._-]{11}$");
doSearch(bodyContent,'');
/* 
 * Function to search the html content for YouTube links
 * Extracts IDs from links and adds them to an array
 */
function doSearch(searchString, previousLink)
{ 
		var linkPos = searchString.search('youtube.com|youtu.be|youtube.com/embed/'); 
		if(linkPos!=-1) 
		{
			// 100 characters gives chance for any parameters that may be included in the link
			linkFound = searchString.substring(linkPos,linkPos+100);
			if (ytLinkPatt.test(linkFound)==true)
			{				console.log("Found embeded ID:" +ytLinkPatt.exec(linkFound)[1]);

				// Extract the YouTube ID from the link
				var videoIdFromReg = ytLinkPatt.exec(linkFound)[1];
				// Check for the link in the array already and confirm the ID is correct form
				if(videoIDs.indexOf(videoIdFromReg) < 0 && idPatt.test(videoIdFromReg) == true)
				{
				    videoIDs.push(videoIdFromReg);
				}	
			}// Now check if the embed form of YouTube link has been found
			else if(ytLinkPattEmbed.test(linkFound)==true)
			{
				// Extract the YouTube ID from the link
				var videoIdFromReg = ytLinkPattEmbed.exec(linkFound)[1];
				// Check for the link in the array already and confirm the ID is correct form
				if(videoIDs.indexOf(videoIdFromReg) < 0 && idPatt.test(videoIdFromReg) == true)
				{
				    videoIDs.push(videoIdFromReg);
				}	
			}
			// end regresult check			
			var newSearchString = searchString.substring(linkPos+10,searchString.length);
			doSearch(newSearchString, videoIdFromReg); // Recursively call the function, starting from posistion after youtube.com
		} // End linkPos 		
}
videoIDs;