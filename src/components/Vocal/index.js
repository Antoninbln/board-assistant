import React, { Component } from "react";
import annyang from "annyang";
import { playSong, search, getArtists, getCover, getTrackName, getDuration } from "../utils/fetchSpotify";

import styles from "./index.module.scss";

class Vocal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTrack: null,
      command: "",
      commandType: "",
      mounted: false
    }

    this.accessToken = "BQBqCjWnEINTAXmS6ft2n0xJUuo6lvHYm-qw4bFTT5uUdCPIXAJZNTk4Qg3y5Oj9U0MfrjBHVkAjSnBOayD3CGAVF44J8uX_8OPzcRjUW9zMLG88SWXVrY0vUIsE3xLt_JKAhMAv4IMHINOM5u0uKzuq3EUWOs099qWJ3ChEGsfh9KtWdDfpO5bj5i05-2lUh09DWY4";
    this.player = null;

    this.checkForSpotify = this.checkForSpotify.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.launchSong = this.launchSong.bind(this);
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
            this.launchSong(song);
          }
          console.log("END - play request");
            // const result = `https://api.spotify.com/v1/search?q=${encodeURI(song)}`;
            // this.setState({ command: song, commandType: "play", toShow: result });
        },
        "joue *song": song => {
          console.log("Start - Play request");
          this.setState({ command: song })
          if (this.player) {
            this.launchSong(song);
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

  launchSong(query) {
    // Search for the track
    search(query, this.accessToken)
      .then(track => {
        this.setState({
          currentTrack: track
        }, () => {
          playSong({
            spotify_uri: track.uri,
            playerInstance: this.player,
            accessToken: this.accessToken
          })
        });
      });
    console.log("test", this.state.currentTrack);
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
    if (this.accessToken !== "") {
      this.setState({ loggedIn: true });
      // check every second if the player is accessible
      this.playerCheckInterval = setInterval(() => this.checkForSpotify(), 1000);
    }
  }

  render() {
    const { currentTrack, command, commandType, toShow, mounted } = this.state;

    console.log("\nRENDER - CURRENT TRACK", this.state.currentTrack);

    return (
      <div className={styles.group}>
        <p>{command || "Parlez un peu..."}  --> Type : {commandType}</p>
        <button onClick={() => this.handleLogin()}>LOG IN</button>
        <button onClick={() => this.launchSong("21 questions")}>PLAY 21 questions</button>
        <button onClick={() => this.launchSong("genesis justice")}>genesis justice</button>
        {currentTrack && (
          <section className="spotify">
            <div className="spotify__player">
              <h2><span className="spotify__player__youre-listening-to">Vous écoutez</span> {getTrackName(currentTrack)} - {
                getArtists(currentTrack).length > 1
                  ? (getArtists(currentTrack).map((item, index) => <span key={`artist-${index}`}>{!index == 0 && " & "}{item}</span>))
                  : <span>{getArtists(currentTrack)[0]}</span>}
              </h2>
              <img src={getCover(currentTrack).url} alt="Pochette d'album" />
              <p>{getDuration(currentTrack)}</p>
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default Vocal;