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

    this.accessToken = "BQDVAkpAdPRI9qOpxEA_iXUZbvD9jofMMap9gYX4zeRV6-91UIbUozMc1Xr6k5fqyhi_R9SjCE1dfI3tjkN1XXneF2jwLxFkLELtRTi-ZrBo7npz3j5cZaAY207lm6-2byXQazrmV90oIYdUn5Us4W3fd5pVWnS_RZYnN1aCwv86cQ2Aco55oUa5wFyoA6zD2X1V74o";
    this.player = null;

    this.checkForSpotify = this.checkForSpotify.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.launchSong = this.launchSong.bind(this);

    this.playerCheckInterval = null;
  }
  
  componentDidMount() {
    this.audio = new Audio();

    if (annyang) {
      console.log("%c > Speech recognition accessible", "color: red; font-weight: 600;");

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
          this.player && this.player.pause();
        },
        "go": () => {
          this.setState({ command: "Resume" });
          this.player && this.player.resume();
        },
        "next": () => {
          this.setState({ command: "Next" });
          // @TODO NOT READY YET
          // this.player && this.player.nextTrack();
        },
        "previous": () => {
          this.setState({ command: "Previous" });
          // @TODO NOT READY YET
          // this.player && this.player.previousTrack();  
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
        if (!track.length > 0) {
          playSong({
            spotify_uri: track.uri,
            playerInstance: this.player,
            accessToken: this.accessToken
          })
        }
        else {
          throw new Error();
        }
      })
      .catch(err => console.error("Houston Houston, we got a situation here !", err));
  }
  /**
   * We check if Playback SDK is loaded (cause Lifecycles methods can't do it)
   */
  checkForSpotify() {
    if (window.Spotify) {
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
    this.player.addListener('player_state_changed', statePlayer => {
      this.setState({
        currentTrack: statePlayer.track_window && statePlayer.track_window.current_track
      });
      console.log("State changed", statePlayer);
    });
  
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
    const { currentTrack, command } = this.state;

    console.log("\nRENDER - STATE", this.state);

    return (
      <div className={styles.group}>
        <p>Commande : {command || "Parlez un peu..."}</p>
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