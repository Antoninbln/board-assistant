import React, { Component } from "react";
import annyang from "annyang";

class Vocal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      command: "",
      commandType: "",
      mounted: false
    }

    this.accessToken = "BQBqoMKv3zXfsIRA-V-Yzo9TI8P-u3QijL6KQbcvUNpPYrxTMiwYPTvYqjwsPymXwtvm7ZT6nBlBl1ShJwsOUB8lr_X4zH1N9sYtPpXRVXrK9sOrdKf0Cu7VkcJeu4vQjaPCcZSiqKr2_CaWEs5h-sk8B_V8cwVK7rEk_PE7AcZ_eiHLRK3CKjp0ycXI6tSt9GWuqK4";
    this.player = null;

    this.checkForSpotify = this.checkForSpotify.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.playSong = this.playSong.bind(this);
    this.search = this.search.bind(this);

    this.playerCheckInterval = null;
  }
  
  componentDidMount() {
    this.audio = new Audio();

    if (annyang) {
      console.log("Speech recognition launched --");
      const commands = {
        "bonjour": () => {
          this.setState({ command: "Bonjour !" });
        },
        "teste": () => {
          this.setState({ comand: "test" });
        },
        "play *song": song => {
          if (this.player) {
            this.search(song).then(uri => this.playSong({ spotify_uri: uri, playerInstance: this.player}));
            const result = `https://api.spotify.com/v1/search?q=${encodeURI(song)}`;
            this.setState({ command: song, commandType: "play", toShow: result });  
          }
        },
        "*anything": anything => this.setState({ command: anything })
      };
      annyang.addCommands(commands);
      annyang.setLanguage('fr-FR');
      annyang.start();
    }
  }

  /**
   * We check if Playback SDK is loaded (cause Lifecycles methods can't do it)
   */
  checkForSpotify() {
    if (window.Spotify !== null ) {
      console.log("Spotify mounted", window.Spotify);
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: "Anto's Player",
        getOAuthToken: cb => cb(this.accessToken)
      });
    
      // Error handling
      this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
      this.player.addListener('account_error', ({ message }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }) => { console.error(message); });
    
      // Playback status updates
      this.player.addListener('player_state_changed', state => { console.log(state); });
    
      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });
    
      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
    
      // Connect to the player!
      this.player.connect();
      console.log(this.player);
    }
  }

  handleLogin() {
    console.log("testing");
    if (this.accessToken !== "") {
      this.setState({ loggedIn: true });
      // check every second for the player.
      this.playerCheckInterval = setInterval(() => this.checkForSpotify(), 1000);
    }
  }

  playSong({
    spotify_uri,
    playerInstance: {
      _options: {
        getOAuthToken,
        id
      }
    }
  }) {
    getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotify_uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
      });
    });
  };
  // spotify:track:70FCugJxa7XW04Np6iYJdI
  
  // REVOIR LES PROMISES !!!!
  search(query) {
    const song = "21 questions";
    let result = fetch(`https://api.spotify.com/v1/search?q=${encodeURI(query)}&type=track`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }})
      .then(res => res.json())
      .then(body => {
        console.log(body.tracks.items[0]);
        return body.tracks.items[0].uri;
      });
    return result;
  }


  // playSong (songName, artistName) {
  //   var query = songName;
  //   if (artistName) {
  //     query += ' artist:' + artistName;
  //   }
  //   this.spotifyApi.searchTracks(query).then(
  //     (response) => {
  //       if (response.tracks.items.length) {
  //         var track = response.tracks.items[0];
  //         this.audio.src = track.uri;
  //         this.audio.play();
  //         // communicateAction('<div>Playing ' + track.name + ' by ' + track.artists[0].name + '</div><img width="150" src="' + track.album.images[1].url + '">');
  //       }
  //     });
  // }

  // search() {
  //   console.log('this.state', this.state);        
  //   const BASE_URL = 'https://api.spotify.com/v1/search?';
  //   const FETCH_URL = BASE_URL + 'q=' + this.state.query + '&type=artist&limit=1';    
  //   var accessToken = 'YOUR_ACCESS_TOKEN'
  //   var myHeaders = new Headers();

  //   var myOptions = {
  //     method: 'GET',
  //     headers:  {
  //       'Authorization': 'Bearer ' + accessToken
  //    },
  //     mode: 'cors',
  //     cache: 'default'
  //   };

  //   fetch(FETCH_URL, myOptions )
  //     .then(response => response.json())
  //     .then(json => console.log(json))
  // }

  render() {
    const { command, commandType, toShow, mounted } = this.state;

    return (
      <div>
        <p className="output">MSG</p>
        <p className="hints">{command || "Parlez un peu..."}  --> Type : {commandType}</p>
        <p className="hints">{toShow}</p>
        <button onClick={() => this.handleLogin()}>PLAY SONG MUTHAFUCKA</button>
        <button
          onClick={
            () => this.playSong({
              playerInstance: this.player,
              spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
            })}
        >
          PLAY
        </button>
        <button
          onClick={
            () => {
              this.search({playerInstance: this.player})
                .then(
                  uri => {
                    console.log(uri);
                    this.playSong({ spotify_uri: uri, playerInstance: this.player});
                  }
                )}
        }>
          PLAY SONG MUTHAFUCKA
        </button>
      </div>
    );
  }
}

export default Vocal;