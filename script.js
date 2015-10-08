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
				callback(response.items[0].contentDetails.relatedPlaylists.uploads);
			});
	}

	// Only returns first video for now.
	function retrieveListOfVideos( playlistId, callback ) {
		var apiURL = 'https://www.googleapis.com/youtube/v3/playlistItems';
		$.get(apiURL, {
			part: 'contentDetails',
			playlistId: playlistId,
			key: apiKey })
			.done(function (response) {
				callback(response.items[0].contentDetails.videoId);
			});
	}

	my.getListOfVideos = function ( username, callback ) {
		retrievePlaylistId(username, function ( id ) {
			retrieveListOfVideos( id, callback );
		});
	};

	return my;

}());

(data.getListOfVideos('lilbpack1', function(id){console.log(id);}));