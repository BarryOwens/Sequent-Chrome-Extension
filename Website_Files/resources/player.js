var links = [];
var videoDuration = 0;
// This is a global variable that the links will be added to in order they appear on screen
var trackList = [];

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
        videoID = youTubeLinks[i].split('v=')[1];
        ampersandPosition = videoID.indexOf('&');
        // If '&' exists in the string
        if (ampersandPosition !== -1) {
            videoID = videoID.substring(0, ampersandPosition);
        }
        links[i] = videoID;
    }
}
// Function to parse out the URL and get the links
function getLinksArrayFromURL() {
	// TODO Validate input
    var passedParameters = window.location.search.substring(1);
    // Remove the parameter name, this can be adjusted in future to allow other parameters
    passedParameters = passedParameters.replace("LinksFound=", '');
    var passedParametersArray = passedParameters.split(',');
    //alert("Found parameters:" + passedParameters);
    console.log(passedParametersArray);
    return passedParametersArray;
}

// Get The link nanes by requesting data from gdata.youtube.com. Update the page once this completes
function getLinkNames() {
    var i = 0, j = 0;
    var titleHolder, videoId;
    var jqxhr;
    for (i = 0; i < links.length; i++) {
        // TODO Seperate the links using a bar | this returns one long json will all info for each video. Get names from this.
        // e.g https://gdata.youtube.com/feeds/api/videos?q=nVggsYu_E8w|1DwUYCrY1_0|peRS3KGNxoY|ulCTotEr7qM|?v=2&alt=json
        jqxhr = $.getJSON("https://gdata.youtube.com/feeds/api/videos/" + links[i] + "?v=2&alt=json", function(data) {
            titleHolder = data.entry.title.$t;
            videoId = data.entry.id.$t;
            videoId = videoId.substring(videoId.length - 11, videoId.length);
        });
    // Once JSON has completed 
    jqxhr.complete(function() {
    // Update After Each Call
    $("#tracklist_container").append(
                    "<div class='track_info' id='trackID" + j + "' onclick=\"handle_select_click_event(this,'" + videoId + "'," + j + ");\">" +
                    "    <div class='track_image'>" +
                    "        <img style='-webkit-user-select: none' src='http://img.youtube.com/vi/" + videoId + "/default.jpg'>" +
                    "    </div>" +
                    "    <div class='track_text'>" +
                    titleHolder +
                    "    </div> " +
                    "    <div class='x_button' id='removeLink" + j + "' onclick=\"handle_remove_click_event(this,'" + videoId + "'," + j + ");\">  " +
                    "        X " +
                    "    </div>" +
                    "</div>"
                );
                trackList[j] = videoId;
                j++;
            }); // end jqxhr complete
        }
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

// Event Handler For selecting what track to play
function handle_select_click_event(obj, val, id) {
    // First remove the visual from the tracklist
    // load the value into the player
    linkNumber = id;
    ytplayer.loadVideoById(val, 1);
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
    ytplayer = document.getElementById("ytplayer");
    console.log('trying to seek to' + (videoDuration * percentage) / 100);
    ytplayer.seekTo((videoDuration * percentage) / 100, true);
	progressBarClicked=false;
}

// Function to change the track details after loading each track
function updateTrackText(val) {
    var trackDetails = $.getJSON("https://gdata.youtube.com/feeds/api/videos/" + val + "?v=2&alt=json", function(data) {
        var trackPlaying = data.entry.title.$t;
        $("#track_details").html(trackPlaying);
    });
}

// Function that is called every second. Gets the current time divides by duration and updates slider value
function updateTime() {
    if (videoPlaying == true) {
        ytplayer = document.getElementById("ytplayer");
        var currTime = ytplayer.getCurrentTime();
        var percentComplete = (currTime / videoDuration) * 100;
        $("#seekbar").slider("option", "value", percentComplete);
    }
}
$(document).ready(function() {
    window.setInterval(function() {
        /// call the update time function here
        updateTime();
    }, 500);

});

// Function that is called when the player is ready to load videos, set up here. 
function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("ytplayer"); // Do a check to see if playerID = typlayer. replace it?
    // Load the first link
    ytplayer.loadVideoById(trackList[linkNumber], 0);
    updateTrackText(trackList[linkNumber]);
    linkNumber++;
    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}

// Called if the player state has changed, used to play the next link 
function onytplayerStateChange(state) {
        if (state == 0) {
            videoPlaying = false;
            // Set the player to load
            ytplayer.loadVideoById(trackList[linkNumber], 1);
            updateTrackText(trackList[linkNumber]);
            linkNumber++;
        }
        if (state == 1) {
            // Set the player to load
            $('#pause_button').css('background-image', "url('"+PauseButton.src+"')");
            $('#pause_button').hover(function() {
                $(this).css('background-image', "url('"+PauseButtonHover.src+"')")
            }, function() {
                $(this).css('background-image', "url('"+PauseButton.src+"')")
            });

            videoDuration = ytplayer.getDuration();
            console.log("Duration: " + videoDuration);
            videoPlaying = true;
        }
    }
    // Button click handlers
$(document).ready(function() {
	ytplayer = document.getElementById("ytplayer");
    $("#pause_button").click(function() {
        // First find if player is playing. unstarted(-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
        var state = ytplayer.getPlayerState();
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
        // First find if player is playing. unstarted(-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
        linkNumber++;
        ytplayer.loadVideoById(trackList[linkNumber], 0);
        updateTrackText(trackList[linkNumber]);
    });
	function play() {
	  if (ytplayer) {
		ytplayer.playVideo();
	  }
	}

	function pause() {
	  if (ytplayer) {
		ytplayer.pauseVideo();
	  }
	}

	function stop() {
	  if (ytplayer) {
		ytplayer.stopVideo();
	  }
	}
	function loadNewVideo(id, startSeconds) {
	  if (ytplayer) {
		ytplayer.loadVideoById(id, startSeconds);
	  }
	}
});