import React, { Component } from "react";
import annyang from "annyang";
import { playSong, search, getArtists, getCover, getTrackName, getDuration, stopSong, resumeSong } from "../utils/fetchSpotify";

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

    this.accessToken = "BQASRvRb8iIr7O1Jqaiosw2IAaeREtt5Lh8udMvbCcOrPXnh_ijvEuSrZ0usb6Rkf18AlOyAyBaLe3AMFpeINbk73tVaaFrYLR5wn5aSyrIbo1hGp-LePhySs7g-7dtWVX9toHEm_-1OMOtrnbPgAZNYoCfYxu9ZZXg4o5eGdxcuos3Xoc8p5SF7-1M-EXtdMN5KGss";
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
          this.setState({ command: song });
          this.player && this.launchSong(song);
        },
        "joue *song": song => {
          this.setState({ command: song });
          this.player && this.launchSong(song);
        },
        "stop": () => {
          this.setState({ command: "Stop" });
          this.player && stopSong({
            playerInstance: this.player,
            accessToken: this.accessToken
          });
        },
        "go": () => {
          console.log("resume");
          this.setState({ command: "Resume" });
          this.player && resumeSong({
            playerInstance: this.player,
            accessToken: this.accessToken
          });
        },
        "change language *lang": lang => {
          // @TODO THIS ISN'T WORKING YET
          // annyang.abort();
          // if (lang == "english") annyang.setLanguage("en-US");
          // else annyang.setLanguage("fr-FR");
          // console.log("lang changed ", lang);
          // annyang.start();
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
        console.log("\n\nTHEN () - ", track);
        this.setState({
          currentTrack: track
        }, () => {
          playSong({
            spotify_uri: track.uri,
            playerInstance: this.player,
            accessToken: this.accessToken
          })
        });
      })
      .catch(err => console.error("Houston Houston, we got a situation here !", err));

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
        name: "Player board",
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
              <h2><span className="spotify__player__youre-listening-to">Vous écoutez</span><br/>{getTrackName(currentTrack)} - {
                getArtists(currentTrack).length > 1
                  ? (getArtists(currentTrack).map((item, index) => <span key={`artist-${index}`}>{!index == 0 && " & "}{item}</span>))
                  : <span>{getArtists(currentTrack)[0]}</span>}
              </h2>
              {getCover(currentTrack) ? <img src={getCover(currentTrack)} alt="Pochette d'album" /> : <p>No cover available</p>}
              <p>{getDuration(currentTrack)}</p>
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default Vocal;