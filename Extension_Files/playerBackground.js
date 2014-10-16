document.addEventListener('DOMContentLoaded', function() {
var foundURLS = new Array();
foundURLS=JSON.parse(localStorage['SequentYoutubeLinks']);
var htmlString = "This is a test: <br>";
		alert("Found urls are: " +foundURLS );
		alert("size or array is "+foundURLS.length);
	for(var i = 0; i <foundURLS.length; i++)
	{
		alert(foundURLS[i]);

		$('#urlContent').append("<br> "+foundURLS[i]);
		
		htmlString = htmlString + "<p> <a href='http://www."+foundURLS[i] +">"+foundURLS[i]+"</a> "  ;
	}

	
document.getElementById("urlContent").innerHTML = htmlString;
});