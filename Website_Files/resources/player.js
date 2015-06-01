var linksPassed = [];
var videoDuration = 0;
// This is a global variable that the links will be added to in order they appear on screen
var trackList = [];

// Youtube API Stuf
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
//// KKK Check typlayer inside 
function onYouTubeIframeAPIReady() {
	player = new YT.Player('ytplayer', {
	  height: '300',
	  width: '300',
	  videoId: 'M7lc1UVf-VE',
	  events: {
		'onReady': onYouTubePlayerReady,
		'onStateChange': onplayerStateChange
	  }
});
}
// Pre-load some images 
PlayButton =  new Image(70, 70);
PlayButton.src = "./resources/play.png";
PlayButtonHover =  new Image(70, 70);
PlayButtonHover.src = "./resources/play_hover.png";
PauseButton= new Image(70, 70);
PauseButton.src = "./resources/pause.png";
PauseButtonHover =  new Image(70, 70);
PauseButtonHover.src = "./resources/pause_hover.png";
BackButton =  new Image(70, 70);
BackButton.src = "./resources/backward_track.png";
BackButtonHover =  new Image(70, 70);
BackButtonHover.src = "./resources/backward_track_hover.png";
ForwardButton =  new Image(70, 70);
ForwardButton.src = "./resources/forward_track.png";
ForwardButtonHover =  new Image(70, 70);
ForwardButtonHover.src = "./resources/forward_track_hover.png";


$(document).ready(function() {
    var youtubes = getLinksArrayFromURL();
    parseYouTubeIDsFromLinks(youtubes);
});
// Parse out the ending characters from the YouTube link
function parseYouTubeIDsFromLinks(youTubeLinks) {
    var i = 0;
    var ampersandPosition, videoID; // The character '&' in the string and found  unique ID
    for (i = 0; i < youTubeLinks.length; i++) {
        videoID = youTubeLinks[i];
        linksPassed[i] = videoID;
    }
}
// Function to parse out the URL and get the links
function getLinksArrayFromURL() {
    var passedParameters = window.location.search.substring(1);
    // Remove the parameter name, this can be adjusted in future to allow other parameters
    passedParameters = passedParameters.replace("LinksFound=", '');
    var passedParametersArray = passedParameters.split(',');
    return passedParametersArray;
}

// Get The link nanes by requesting data from Youtube Data Api. Update the page once this completes
function getLinkNames() {
    var i = 0, j = 0;
    var titleHolder, videoId;
	var tracksLoaded = [];
    var jqxhr;
    for (i = 0; i < linksPassed.length; i++) {
        // Possible Future work: Seperate the links using a bar | this returns one long json will all info for each video. Get names from this.
        jqxhr = $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + linksPassed[i] + "&key=AIzaSyB4ZjzqWb3dZeU7-5Q1H5bX9gDvZTihxqI", function(data) {
            titleHolder = data.items[0].snippet.title;
			titleHolder = titleHolder.substring(0,50); // Set Max text size
            videoId = data.items[0].id;
            //videoId = videoId.substring(videoId.length - 11, videoId.length); //
        });
		// Once JSON has completed 
		jqxhr.complete(function() {
		if (tracksLoaded.indexOf(videoId) < 0 && typeof videoId != 'undefined' )
		{
		tracksLoaded[j] = videoId;
		// Update After Each Call
		$("#tracklist_container").append(
						"<div class='track_info' id='trackID" + j + "' onclick=\"handle_select_click_event(this,'" + videoId + "'," + j + ");\">" +
						"    <div class='track_image'>" +
						"        <img style='-webkit-user-select: none' src='http://img.youtube.com/vi/" + videoId + "/default.jpg'>" +
						"    </div>" +
						"    <div class='track_text'>" +
						titleHolder +
						"    </div> " +
						"    <div class='left_col'> " +			
						"    	<div class='x_button' id='removeLink" + j + "' onclick=\"handle_remove_click_event(this,'" + videoId + "'," + j + ");\">  " +
						"        <img src='./resources/x_icon.png'> " +
						"    	</div>" +
						"    	<div class='ytLink' onclick='handle_ytLink_click_event(this)'> " +	
						"        <A HREF='http://www.youtube.com/watch?v="+ videoId + "' target='_blank'> <img src='./resources/link.png'> </a>  " +
						"     	</div>" +
						"    </div>" +
						"           " +
						"           " +		
						"</div>"
					);
					trackList[j] = videoId;
					j++;
		} // End track loaded if
		}); // End jqxhr complete
    } // End For Loop
} // End getLinkNames

// Custom function to remove value when passed the value
Array.prototype.remove = function(value) {
    var idx = this.indexOf(value);
    if (idx != -1) {
        return this.splice(idx, 1); // The second parameter is the number of elements to remove.
    }
    return false;
}

// Event Handler For Removing Lined up Tracks, Must Change to Remove Values not Positions
function handle_remove_click_event(obj, val, id) {
    // First remove the visual from the tracklist
    var element = document.getElementById("trackID" + id);
    element.parentNode.removeChild(element);
    // Then call custom function to remove from array when passed a value
    trackList.remove(val);
    var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}
function handle_ytLink_click_event(obj) {
	// do the 
	var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}


// Event Handler For selecting what track to play
function handle_select_click_event(obj, val, id) {
    // load the value into the player
    linkNumber = id;
    player.loadVideoById(val, 0,'large');
    updateTrackText(val);
}

// Load video links and update tracklist
$(document).ready(function() {
    getLinkNames();
});

var progressBarClicked=false;
// On mouse click, get slider value. pass to update video position
$(document).ready(function() {
    document.getElementById('seekbar').onclick = function() {
		progressBarClicked=true;
		seekValue = $( "#seekbar" ).slider( "option", "value" );
        ytVidSeekTo(seekValue);
    }
});

// Set the Slider to increment by .2
$(document).ready(function() {
	if(progressBarClicked=false)
	{
		$("#seekbar").slider({
			min: 0,
			max: 100,
			step: .2,
			change: function(event, ui) {
				document.getElementById('track_pos').val = ui.value;
			}
		});

		$("#update").click(function() {
			$("#seekbar").slider("option", "value", $("#seekTo").val());
		});
	}
});

var linkNumber = 0;
var videoPlaying = false;

// Change video time to the selected time on the slider
function ytVidSeekTo(percentage) {
    player.seekTo((videoDuration * percentage) / 100, true);
	progressBarClicked=false;
}

// Function to change the track details after loading each track
function updateTrackText(val) {
    var trackDetails = $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + val + "&key=AIzaSyB4ZjzqWb3dZeU7-5Q1H5bX9gDvZTihxqI", function(data) {
        var trackPlaying = data.items[0].snippet.title;
        $("#track_details").html(trackPlaying.substring(0,50));
		document.title = trackPlaying.substring(0,50);
		
    });
}

// Function that is called every second. Gets the current time divides by duration and updates slider value
function updateTime() {
    if (videoPlaying == true) {
        var currTime = player.getCurrentTime();
        var percentComplete = (currTime / videoDuration) * 100;
        $("#seekbar").slider("option", "value", percentComplete);
    }
}
$(document).ready(function() {
    window.setInterval(function() {
        // call the update time function here
        updateTime();
    }, 500);

});

// Function that is called when the player is ready to load videos, set up here. 
function onYouTubePlayerReady(event) {
    // Load the first link
    event.target.loadVideoById(trackList[linkNumber], 0,'large');
    updateTrackText(trackList[linkNumber]);
	player.playVideo();
}

// Called if the player state has changed, used to play the next link 
function onplayerStateChange(state) {
	state=state.data;
        if (state == 0) {
            videoPlaying = false;
            linkNumber++;
            // Set the player to load
            player.loadVideoById(trackList[linkNumber], 0,'large');
            updateTrackText(trackList[linkNumber]);
        }
        if (state == 1) {
            // Set the player to load
            $('#pause_button').css('background-image', "url('"+PauseButton.src+"')");
            $('#pause_button').hover(function() {
                $(this).css('background-image', "url('"+PauseButtonHover.src+"')")
            }, function() {
                $(this).css('background-image', "url('"+PauseButton.src+"')")
            });
            videoDuration = player.getDuration(); // TODO Fix duration getter
            videoPlaying = true;
        }
    }
    // Button click handlers
$(document).ready(function() {
    $("#pause_button").click(function() {
        // First find if player is playing. unstarted(-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
        var state = player.getPlayerState();
        if (state == 1 || state == 3) {
            pause();
            $('#pause_button').css('background-image', "url('"+PlayButton.src+"')");
            $('#pause_button').hover(function() {
                $(this).css('background-image', "url('"+PlayButtonHover.src+"')")
            }, function() {
                $(this).css('background-image', "url('"+PlayButton.src+"')")
            });

        } else {
            play();
            $('#pause_button').css('background-image', PauseButton);
            $('#pause_button').hover(function() {
                $(this).css('background-image', PauseButtonHover)
            }, function() {
                $(this).css('background-image', PauseButton)
            });
        }
    });
    $("#forward_button").click(function() {
        linkNumber++;
        player.loadVideoById(trackList[linkNumber], 0,'large');
        updateTrackText(trackList[linkNumber]);
    });
	$("#back_button").click(function() {
		if(linkNumber!=0) 
			linkNumber--;			
			player.loadVideoById(trackList[linkNumber], 0,'large');
			updateTrackText(trackList[linkNumber]);
    });
	function play() {
	  if (player) {
		player.playVideo();
	  }
	}

	function pause() {
	  if (player) {
		player.pauseVideo();
	  }
	}

	function stop() {
	  if (player) {
		player.stopVideo();
	  }
	}
	function loadNewVideo(id, startSeconds) {
	  if (player) {
		player.loadVideoById(id, startSeconds,'large');
	  }
	}
});
