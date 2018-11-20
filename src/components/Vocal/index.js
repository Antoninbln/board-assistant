import React, { Component } from "react";
import annyang from "annyang";
import { playSong, searchSong, searchAlbum, getArtists, getCover, getTrackName, getDuration } from "../utils/fetchSpotify";

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
      commandType: ""
    };

    this.accessToken = "BQCCSqGBY0m9Avvs_tnGwY4OA67-SE5Mskh6AAxz4MAGGRrtaD6yF9VofXjIXbjpqzf4nnDW0pGy0qvVJZJKMu7_eCAb7VUZeGHItOj5OjKitk43iwS8UM7RODj9nwIKONMdAUPwk1ymrCQvf0FeiA-jLoxZaOiaUkrj59myfbLLl05jcJ2YrUpHzJl07T6zlG9MmHk";
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

    this.handleLogin();
  }

  launchSong(query) {
    // Search for the track
    searchSong(query, this.accessToken)
      .then(track => {
        console.log("track", track);
        if (track.length > 0) {
          playSong({
            spotify_uri: track,
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

  launchAlbum(query) {
    // Search for the track
    searchAlbum(query, this.accessToken)
      .then(track => {
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
        getOAuthToken: cb => {
          // Request for refresh should be done here
          cb(this.accessToken)
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
    this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
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
    const { currentTrack, previousTrack, nextTrack, command } = this.state;

    console.log("\nRENDER - STATE", this.state);

    return (
      <div className={styles.group}>
        <p>Commande : {command || "Parlez un peu..."}</p>
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