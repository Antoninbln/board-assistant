import React, { Component } from "react";
import annyang from "annyang";
import { playSong, search } from "../utils/fetchSpotify";

class Vocal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      command: "",
      commandType: "",
      mounted: false
    }

    this.accessToken = "BQA-VlTV_mNDlf-NdCxyFqYjRwUMhN1eu3V-7rwJBbKWAJjffgYuoHYjNqyfg9odR0OY-sqrybEsXubs5t8ySqISqv6mG8eZNDk-9qTgP9ggFw0n2NmTkPJ7jLWbRlAea6zM7BBPqMw5nab5riEd7NtqcndjY5jnWXUCpxqACPpE3RGc2sMGjx-tpw0Wh7kGShmOdVM";
    this.player = null;

    this.checkForSpotify = this.checkForSpotify.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    // this.playSong = this.playSong.bind(this);
    // this.search = this.search.bind(this);

    this.playerCheckInterval = null;
  }
  
  componentDidMount() {
    this.audio = new Audio();

    if (annyang) {
      console.log("%c > Speech recognition launched", "color: red; font-weight: 600;");
      const commands = {
        "bonjour": () => {
          this.setState({ command: "Bonjour !" });
        },
        "teste": () => {
          this.setState({ comand: "test" });
        },
        "play *song": song => {
          console.log("Start - Play request");
          this.setState({ command: song })
          if (this.player) {
            search(song, this.accessToken).then(uri => playSong({
              spotify_uri: uri,
              playerInstance: this.player,
              accessToken: this.accessToken
            }));
            // const result = `https://api.spotify.com/v1/search?q=${encodeURI(song)}`;
            // this.setState({ command: song, commandType: "play", toShow: result });
          }
          console.log("END - play request");
        },
        "joue *song": song => {
          console.log("Start - Play request");
          this.setState({ command: song })
          if (this.player) {
            search(song, this.accessToken).then(uri => playSong({
              spotify_uri: uri,
              playerInstance: this.player,
              accessToken: this.accessToken
            }));
            // const result = `https://api.spotify.com/v1/search?q=${encodeURI(song)}`;
            // this.setState({ command: song, commandType: "play", toShow: result });
          }
          console.log("END - play request");
        },
        "*anything": anything => this.setState({ command: anything })
      };
      annyang.addCommands(commands);
      annyang.setLanguage('fr-FR');
      annyang.start();
    }

    this.handleLogin();
  }

  /**
   * We check if Playback SDK is loaded (cause Lifecycles methods can't do it)
   */
  checkForSpotify() {
    if (window.Spotify !== null ) {
      console.log("%c > Spotify accessible", "color: red; font-weight: 600;");
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: "Mon player",
        getOAuthToken: cb => cb(this.accessToken)
      });
    
      this.apiEventHandler();
    }
  }

  /**
   * Handle events about the connection to Spotify API
   */
  apiEventHandler() {
    // Error handling
    this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
    this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
    this.player.addListener('account_error', ({ message }) => { console.error(message); });
    this.player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    this.player.addListener('player_state_changed', state => { console.log(state); });
  
    // Ready
    this.player.addListener('ready', ({ device_id }) => console.log('Ready with Device ID', device_id));
  
    // Not Ready
    this.player.addListener('not_ready', ({ device_id }) => console.log('Device ID has gone offline', device_id));
  
    // Connect to the player!
    this.player.connect();
  }

  /**
   * Create an interval to check when player is ready
   */
  handleLogin() {
    console.log("testing");
    if (this.accessToken !== "") {
      this.setState({ loggedIn: true });
      // check every second if the player is accessible
      this.playerCheckInterval = setInterval(() => this.checkForSpotify(), 1000);
    }
  }

  render() {
    const { command, commandType, toShow, mounted } = this.state;

    return (
      <div>
        <p className="output">MSG</p>
        <p className="hints">{command || "Parlez un peu..."}  --> Type : {commandType}</p>
        <p className="hints">{toShow}</p>
        <button onClick={() => this.handleLogin()}>LOG IN</button>
        <button
          onClick={
            () => playSong({
              playerInstance: this.player,
              spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
              accessToken: this.accessToken
            })}
        >
          PLAY
        </button>
        <button
          onClick={
            () => search("21 questions", this.accessToken).then(
                uri => {
                  console.log("Track URI", uri);
                  playSong({
                    spotify_uri: uri,
                    playerInstance: this.player,
                    accessToken: this.accessToken
                  });
                }
            )}
        >
          PLAY SONG MUTHAFUCKA
        </button>
      </div>
    );
  }
}

export default Vocal;