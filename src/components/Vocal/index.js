import React, { Component } from "react";
import annyang from "annyang";
import { playSong, searchSong, searchAlbum, getArtists, getCover, getTrackName, getDuration, getHashParams, getNewAccessToken } from "../utils/fetchSpotify";

import styles from "./index.module.scss";
import BesideTrack from "./BesideTrack";

class Vocal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTrack: null,
      nextTrack: null,
      previousTrack: null,
      command: "",
      commandType: "",
      spotifyLogged: false,
      accessToken: null,
      refreshToken: null
    };

    this.player = null;

    this.checkForSpotify = this.checkForSpotify.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.launchSong = this.launchSong.bind(this);

    this.playerCheckInterval = null;
  }

  componentDidMount() {
    this.audio = new Audio();

    // Retrieve papams from URL
    if (window) {
      const params = getHashParams();
      this.setState({
        accessToken: params && params.access_token,
        refreshToken: params && params.refresh_token
      }, () => this.handleLogin());
    }

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
        "album *album": album => {
          this.setState({ command: album });
          this.player && this.launchAlbum(album);
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
          this.player && this.player.nextTrack();
        },
        "previous": () => {
          this.setState({ command: "Previous" });
          this.player && this.player.previousTrack();  
        },
        "forward": () => {
          this.setState({ command: "Seek" });
          this.player && this.player.seek(1000 * 60); // Move to 1 min
        },
        "backward": () => {
          this.setState({ command: "Reset" });
          this.player && this.player.seek(0);  
        },
        "*anything": anything => this.setState({ command: anything })
      };

      annyang.addCommands(commands);
      annyang.setLanguage('fr-FR');
      annyang.start();
    }
  }

  /**
   * Play song
   * Details : 1. Fetch new access_token -> 2. Fetch song data -> 3. Play song
   * @param { String } query 
   * @return { Void }
   */
  launchSong(query) {
    const { refreshToken } = this.state;

    console.log("== LAUNCH SONG ========");
    getNewAccessToken(refreshToken)
      .then(newToken => {
        console.log("LAUNCH SONG - THEN ", newToken);
        searchSong(query, newToken) // Search for the track
          .then(track => {
            console.log("track", track);
            if (track.length > 0) {
              playSong({
                spotify_uri: track,
                playerInstance: this.player,
                accessToken: newToken
              });
            }
          })
          .catch(err => console.error("Houston Houston, we got a situation here !", "Cf. Song", err));
      })
      .catch(err => console.error("Error ", err));    
  }

  /**
   * Play album
   * Details : 1. Fetch new access_token -> 2. Fetch album data -> 3. Play album song
   * @param { String } query 
   * @return { Void }
   */
  launchAlbum(query) {
    const { refreshToken } = this.state;

    getNewAccessToken(refreshToken)
      .then(newToken => {
        searchAlbum(query, newToken) // Search for the album
          .then(track => {
            if (!track.length > 0) {
              playSong({
                spotify_uri: track.uri,
                playerInstance: this.player,
                accessToken: newToken
              });
            }
          })
          .catch(err => console.error("Houston Houston, we got a situation here !", "Cf. Album", err));
        }
      )
  }

  /**
   * Check if Playback SDK is loaded (cause Lifecycles methods can't do it)
   */
  checkForSpotify() {
    const { refreshToken } = this.state;

    if (window.Spotify) {
      console.log("%c > Spotify accessible", "color: red; font-weight: 600;");
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: "Player board",
        getOAuthToken: cb => {
          getNewAccessToken(refreshToken)
            .then(newToken => cb(newToken))
            .catch(err => console.error("Houston Houston, we got a situation here !", "Cf. CheckForSpotify", err));
        }
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
    this.player.addListener('authentication_error', ({ message }) => { console.error("Failed to authenticate account", message) });
    this.player.addListener('account_error', ({ message }) => { console.error(message); });
    this.player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    this.player.addListener('player_state_changed', statePlayer => {
      this.setState({
        currentTrack: statePlayer.track_window && statePlayer.track_window.current_track,
        previousTrack: statePlayer.track_window && statePlayer.track_window.previous_tracks && statePlayer.track_window.previous_tracks[0],
        nextTrack: statePlayer.track_window && statePlayer.track_window.next_tracks && statePlayer.track_window.next_tracks[0]
      });
      console.log("State changed", statePlayer);
    });
  
    // Ready
    this.player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      this.setState({ logged: true });
    });
  
    // Not Ready
    this.player.addListener('not_ready', ({ device_id }) => console.log('Device ID has gone offline', device_id));
  
    // Connect to the player!
    this.player.connect();
  }

  /**
   * Create an interval to check when player is ready
   */
  handleLogin() {
    const { accessToken } = this.state;
    if (accessToken !== "") {
      this.setState({ loggedIn: true });
      // check every second if the player is accessible
      this.playerCheckInterval = setInterval(() => this.checkForSpotify(), 1000);
    }
  }

  render() {
    const { currentTrack, previousTrack, nextTrack, command, accessToken, refreshToken } = this.state;
    console.log("\nRENDER - STATE", this.state);
    console.log("RENDER - Access", accessToken);

    return (
      <div className={styles.group}>
        <p>Commande : {command || "Parlez un peu..."}</p>
        <button onClick={() => getNewAccessToken(refreshToken)}>Refresh access</button>
        <button onClick={() => this.launchSong("The bravery")}>PLAY - The Brave</button>
        {currentTrack && (
          <section className="spotify">
            <div className="spotify__player">
              <h2><span className="spotify__player__youre-listening-to">Vous écoutez</span><br/>{getTrackName(currentTrack)} - {
                getArtists(currentTrack).length > 1
                  ? (getArtists(currentTrack).map((item, index) => <span key={`artist-${index}`}>{!index == 0 && " & "}{item}</span>))
                  : <span>{getArtists(currentTrack)[0]}</span>}
              </h2>
              <p>{getDuration(currentTrack)}</p>
              {getCover(currentTrack) ? <img src={getCover(currentTrack)} alt="Pochette d'album" /> : <p>No cover available</p>}
              <div className="spotify__player__footer">
                {previousTrack && <BesideTrack track={previousTrack} />}
                {nextTrack && <BesideTrack track={nextTrack} isNext />}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default Vocal;