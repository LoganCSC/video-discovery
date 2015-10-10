
/** This module allows you to get videos from a specified youtube channel */
var youTubeAccess = (function () {
	
	// The my object holds public functions and properties
	var my = {};
	
	// Mian's secret YouTube API key - don't abuse it. Probably this should not be in GIT.
	var apiKey = 'AIzaSyBfkB9tp5_M6nh3yXj9BXnYYHkMqRnxcQM';
	// URL Prefix for all youTube REST API calls
	var youTubeAPI = 'https://www.googleapis.com/youtube/v3/';

	/** 
	 * @param username the user for whom you will be retrieving a playlist
	 * @param callback the function to call when the play list id has been retrieved
	 * @return the youtube play id given the users name and a function to callback 
	 */
	function retrievePlaylistId ( username, callback ) {
		// URL to youtube channels
		var apiURL = youTubeAPI + 'channels';
		
		var parameters = {
			part: 'contentDetails',
			forUsername: username,
			key: apiKey 
		};
			
		$.get(apiURL, parameters, 'json')
			.done(function idFromResponse(response) {
				
				var firstPlayListItem = response.items[0];
				if (!firstPlayListItem) {
					alert("You need to specifiy a valid YouTube channel");
				}
				
				callback(firstPlayListItem.contentDetails.relatedPlaylists.uploads);
			});
	}

	/**
	 * @param playListId id of play list to retrieve
	 * @param callback function to call with the list of videos
	 */
	function retrieveListOfVideos( playlistId, callback ) {
		// URL to youtube playlists
		var apiURL = youTubeAPI + 'playlistItems';
		
		var parameters = {
			part: 'contentDetails',
			playlistId: playlistId,
			key: apiKey 
		};
		
		$.get(apiURL, parameters)
			.done(function (response) {
				callback(response);
			});
	}
	
	/** @return a random video id from the list of videos */
	function selectRandomId( json ) {
		var randInteger = Math.floor(Math.random() * json.items.length);
		return json.items[randInteger].contentDetails.videoId;
	}

	/**
	 * @param username name of the youtube user who will provide random video
	 * @param callback what to call when a random video has been selected
	 */
	my.getRandomVideo = function ( username, callback ) {
		retrievePlaylistId(username, function ( playlistId ) {
			retrieveListOfVideos( playlistId, function ( videoIdList ) {
				callback(selectRandomId( videoIdList ));
			});
		});
	};

	return my;

}());

/**
 * This is called when the user clicks the play button (see onclick handler in the html)
 * It uses jQuery to dynamically upate the html Document Object Model (DOM)
 * with an ifrme containing the view element.
 * Note that any existing video players are removed first (also usig jQuery).
 */
function appendVideo() {
	$('#videoPlayer').remove();
	youTubeAccess.getRandomVideo($('#userInput').val(), function( videoId ){
		$('body')
			.append('<iframe id="videoPlayer" width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>');
	});
}