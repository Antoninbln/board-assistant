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

    // Retrieve params from URL
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

        "album *album": album => {
          this.setState({ command: album });
          this.player && this.launchAlbum(album);
        },
        "joue *song": song => {
          this.setState({
            command: song,
            previousTrack: null,
            nextTrack: null
          }, () => this.player && this.launchSong(song));
        },
        "play *song": song => {
          this.setState({
            command: song,
            previousTrack: null,
            nextTrack: null
          }, () => this.player && this.launchSong(song));
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
          this.setState({
            command: "Next",
            previousTrack: null,
            nextTrack: null
          }, () => this.player && this.player.nextTrack());
        },
        "previous": () => {
          this.setState({
            command: "Previous",
            previousTrack: null,
            nextTrack: null
          }, () => this.player && this.player.previousTrack());
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
      annyang.setLanguage('en-US');
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

    getNewAccessToken(refreshToken)
      .then(newToken => {
        searchSong(query, newToken) // Search for the track
          .then(track => {
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
    });
  
    // Ready
    this.player.addListener('ready', ({ device_id }) => { console.log('Ready with Device ID', device_id); });
  
    // Not Ready
    this.player.addListener('not_ready', ({ device_id }) => console.log('Device ID has gone offline', device_id));
  
    // Connect to the player!
    this.player.connect();
  }

  /**
   * Create an interval to check when player is ready
   * (Check every second if the player is accessible)
   */
  handleLogin() {
    const { accessToken } = this.state;

    if (accessToken !== "") this.playerCheckInterval = setInterval(() => this.checkForSpotify(), 1000);
  }

  render() {
    const { currentTrack, previousTrack, nextTrack, command, refreshToken } = this.state;

    const cover = currentTrack && getCover(currentTrack);

    return (
      <div className={styles.group}>
        {/* <button onClick={() => this.launchSong("david bowie")}>Play - David Bowie</button> */}
        {currentTrack && (
          <section className="spotify">
            <div className="spotify__player txt__white">
              <h2 className="spotify__player__head"><span className="youre-listening-to">Vous écoutez</span><br/>{getTrackName(currentTrack)} - {
                getArtists(currentTrack).length > 1
                  ? getArtists(currentTrack).map(
                      (item, index) => (
                        <span key={`artist-${index}`}>{!index == 0 && " & "}{item}</span>
                      ))
                  : <span>{getArtists(currentTrack)[0]}</span>}
                <p>{getDuration(currentTrack)}</p>
              </h2>
              {cover ? <img className="spotify__player__cover" src={cover} alt="Pochette d'album" /> : <p>No cover available</p>}
              <div className="spotify__player__footer">
                {previousTrack && <BesideTrack track={previousTrack} />}
                {nextTrack && <BesideTrack track={nextTrack} isNext />}
              </div>
            </div>
            {cover && <div className="spotify__player__bg" style={{ backgroundImage: `url(${cover})` }} />}
          </section>
        )}
        <section className={`${styles.vocal} vocal`}>
          <p>{command || "Ask something..."}</p>
        </section>
      </div>
    );
  }
}

export default Vocal;
