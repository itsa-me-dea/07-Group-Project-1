var options = ['Select your mood', 'Romantic', 'Anger', 'Fear', 'Gloomy', 'Calm', 'Playful', 'Surprise', 'Rock', 'Pop', 'Jazz', 'Country', 'Classical', 'Dance', 'Alternative', 'Latin', 'Suprise-me'];


document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, options);
});

 

  
// spotify API: adapted from https://github.com/sammy007-debug/How-to-use-Spotify-s-API-with-Javascript
var APIController = (function() {
  // pulled from spotify dashboard upon app registration
  var clientId = '11af7816bf434f9bba3da85a2dcecd11';
  var clientSecret = 'c8b15d0bed084b69bbb5e30bda880c7a';
  
  // get the spotify API token
  var _getToken = async () => {

      var result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/x-www-form-urlencoded', 
              'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
      });

      var data = await result.json();
      console.log('getToken: ' + data)
      return data.access_token;
  }
  
  // grab genre list from spotify to apply to list (not implemented)
  var _getGenres = async (token) => {

      var result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      var data = await result.json();
      console.log('getGenre: ' + data)
      return data.categories.items;
  }

  // apply selected genre (mood not working) to call list from spotify API
  var _getPlaylistByGenre = async (token, genreId) => {

      var limit = 5;
      
      var result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      var data = await result.json();
      console.log('getPlaylistByGenre: ' + data)
      return data.playlists.items;
      // then(function (data) {
      //   console.log(data);
      // });

  }

  var _getTracks = async (token, tracksEndPoint) => {

      var limit = 5;

      var result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      var data = await result.json();
      console.log('getTracks: ' + data)
      return data.items;
  }

  var _getTrack = async (token, trackEndPoint) => {

      var result = await fetch(`${trackEndPoint}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      var data = await result.json();
      console.log('getTrack: ' + data)
      return data;
  }

  return {
      getToken() {
          return _getToken();
      },
      getGenres(token) {
          return _getGenres(token);
      },
      getPlaylistByGenre(token, genreId) {
          return _getPlaylistByGenre(token, genreId);
      },
      getTracks(token, tracksEndPoint) {
          return _getTracks(token, tracksEndPoint);
      },
      getTrack(token, trackEndPoint) {
          return _getTrack(token, trackEndPoint);
      }
  }
})();


// UI Module
var UIController = (function() {

  //object to hold references to html selectors
  var DOMElements = {
      selectGenre: '#drop-down',
      selectPlaylist: '#select_playlist',
      buttonSubmit: '#search-button',
      divSongDetail: '#song-detail',
      hfToken: '#hidden_token',
      divSonglist: '.song-list'

  }

  //public methods
  return {

      //method to get input fields
      inputField() {
          return {
              genre: document.querySelector(DOMElements.selectGenre),
              playlist: document.querySelector(DOMElements.selectPlaylist),
              tracks: document.querySelector(DOMElements.divSonglist),
              submit: document.querySelector(DOMElements.buttonSubmit),
              songDetail: document.querySelector(DOMElements.divSongDetail)
          }
      },

      // need methods to create select list option
      createGenre(text, value) {
          var html = `<option value="${value}">${text}</option>`;
          document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
      }, 

      createPlaylist(text, value) {
          var html = `<option value="${value}">${text}</option>`;
          document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
      },

      // need method to create a track list group item 
      createTrack(id, name) {
          var html = `<a href="#!" class="collection-item" id="${id}">${name}</a>`;
          document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
      },

      // need method to create the song detail
      createTrackDetail(img, title, artist, spotify) {
        var detailDiv = document.querySelector(DOMElements.divSongDetail);
        detailDiv.innerHTML = '';
      
        var html = `
          <div class="row">
            <div class="col s3 offset-s1 m3 offset-m1">
              <div class="card">
                <div class="card-image">
                  <img src="${img}" alt="">
                </div>
                <div style="background-color: black; class="card-content">
                  <label for="Genre" class="form-label col-sm-12">Title: ${title}</label>
                  <br>
                  <label for="artist" class="form-label col-sm-12">Artist: ${artist}</label>
                </div>
                <div class="card-action">
                  <a href="${spotify}"><i class="fa-brands fa-spotify fa-2xl" style="color: #1DB954;"></i></a>
                </div>
              </div>
            </div>
          </div>
        `;
      
        detailDiv.insertAdjacentHTML('beforeend', html);
      
        // Search YouTube and add the video URL
        //We're taking the title and artist from the spotify search result and using them as parameters for youtubes API to search with. 
        searchYouTube(title, artist)
          .then((youtubeUrl) => {
            if (youtubeUrl) {
              var cardActionDiv = document.querySelector('.card-action');
              var youtubeLink = document.createElement('a');
              youtubeLink.href = youtubeUrl;
              youtubeLink.className = 'card-action';
              youtubeLink.target = '_blank';
              var youtubeIcon = document.createElement('i');
              youtubeIcon.className = 'fa-brands fa-youtube fa-2xl';
              youtubeIcon.style.color = '#FF0000';
              //We are appending the a tag to the card-action div so spotify and YT are on the same line.
              youtubeLink.appendChild(youtubeIcon);
              cardActionDiv.appendChild(youtubeLink);
            }
          })
          .catch((error) => {
            console.error('YouTube API error:', error);
          });
      
      
      
    
      },

      resetTrackDetail() {
          this.inputField().songDetail.innerHTML = '';
      },

      resetTracks() {
          this.inputField().tracks.innerHTML = '';
          this.resetTrackDetail();
      },

      resetPlaylist() {
          this.inputField().playlist.innerHTML = '';
          this.resetTracks();
      },
      
      storeToken(value) {
          document.querySelector(DOMElements.hfToken).value = value;
      },

      getStoredToken() {
          return {
              token: document.querySelector(DOMElements.hfToken).value
          }
      }
  }

})();

var APPController = (function(UICtrl, APICtrl) {

  // get input field object ref
  var DOMInputs = UICtrl.inputField();

  // get genres on page load
  var loadGenres = async () => {
      //get the token
      var token = await APICtrl.getToken();           
      //store the token onto the page
      UICtrl.storeToken(token);
      //get the genres
      var genres = await APICtrl.getGenres(token);
      //populate our genres select element
      genres.forEach(element => UICtrl.createGenre(element.name, element.id));
  }

  // create genre change event listener
  DOMInputs.genre.addEventListener('change', async () => {
      //reset the playlist
      UICtrl.resetPlaylist();
      //get the token that's stored on the page
      var token = UICtrl.getStoredToken().token;        
      // get the genre select field
      var genreSelect = UICtrl.inputField().genre;       
      // get the genre id associated with the selected genre
      var genreId = genreSelect.options[genreSelect.selectedIndex].value;
      // var genreId = genreQuery;             
      // ge the playlist based on a genre
      var playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
      // create a playlist list item for every playlist returned
      playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
  });
   

  // create submit button click event listener
  DOMInputs.submit.addEventListener('click', async (e) => {
      // prevent page reset
      e.preventDefault();
      // clear tracks
      UICtrl.resetTracks();
      //get the token
      var token = UICtrl.getStoredToken().token;        
      // get the playlist field
      var playlistSelect = UICtrl.inputField().playlist;
      // get track endpoint based on the selected playlist
      var tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
      // get the list of tracks
      var tracks = await APICtrl.getTracks(token, tracksEndPoint);
      // create a track list item
      tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
      
  });

  // create song selection click event listener
  DOMInputs.tracks.addEventListener('click', async (e) => {
      // prevent page reset
      e.preventDefault();
      UICtrl.resetTrackDetail();
      // get the token
      var token = UICtrl.getStoredToken().token;
      // get the track endpoint
      var trackEndpoint = e.target.id;
      //get the track object
      var track = await APICtrl.getTrack(token, trackEndpoint);
      // load the track details
      UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name, track.external_urls.spotify);

      console.log("UICtrl: " + UICtrl.stringify);
  });    

  return {
      init() {
          console.log('App is starting');
          loadGenres();
      }
  }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();


// Search YouTube based on track title and artist
var searchYouTube = async (title, artist) => {
  var apiKey = 'AIzaSyCUaBzS3x1TRvHowScmBseZ4yHIbkxfB9s';
  var query = `${title} ${artist}`;
  var apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;

  var response = await fetch(apiUrl);
  var data = await response.json();

  if (data.items && data.items.length > 0) {
    var videoId = data.items[0].id.videoId;
    var videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    return videoUrl;
  }

  return null;
}

