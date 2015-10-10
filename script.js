var data = (function () {
	var my = {},
		apiKey = 'AIzaSyBfkB9tp5_M6nh3yXj9BXnYYHkMqRnxcQM';

	function retrievePlaylistId ( username, callback ) {
		var apiURL = 'https://www.googleapis.com/youtube/v3/channels';
		$.get(apiURL, {
			part: 'contentDetails',
			forUsername: username,
			key: apiKey }, 'json')
			.done(function idFromResponse(response) {
				if (!response.items[0]) {
					alert("You need to specifiy a valid YouTube channel");
				}
				callback(response.items[0].contentDetails.relatedPlaylists.uploads);
			});
	}

	function retrieveListOfVideos( playlistId, callback ) {
		var apiURL = 'https://www.googleapis.com/youtube/v3/playlistItems';
		$.get(apiURL, {
			part: 'contentDetails',
			playlistId: playlistId,
			key: apiKey })
			.done(function (response) {
				callback(response);
			});
	}
	
	function selectRandomId( json ) {
		var randInteger = Math.floor(Math.random() * json.items.length);
		return json.items[randInteger].contentDetails.videoId;
	}

	my.getListOfVideos = function ( username, callback ) {
		retrievePlaylistId(username, function ( playlistId ) {
			retrieveListOfVideos( playlistId, function ( videoIdList ) {
				callback(selectRandomId( videoIdList ));
			});
		});
	};

	return my;

}());

function appendVideo() {
	$('#videoPlayer').remove();
	data.getListOfVideos($('#userInput').val(), function( videoId ){
		$('body').append('<iframe id="videoPlayer" width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>');
	});
}