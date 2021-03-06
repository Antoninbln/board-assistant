import React, { Component } from "react";
import PropTypes from "prop-types";

import annyang from "annyang";
import { playSong, searchSong, searchAlbum, getArtists, getCover, getTrackName, getDuration, getHashParams, getNewAccessToken } from "utils/fetchSpotify";

import styles from "./index.module.scss";
import CarouselTracks from "./CarouselTracks";

class Vocal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      command: "",
      accessToken: null,
      refreshToken: null,
    };

    this.player = null;

    this.checkForSpotify = this.checkForSpotify.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.launchSong = this.launchSong.bind(this);

    this.playerCheckInterval = null;
  }

  componentDidMount() {
    const { openMeteo, openBus } = this.props;
    
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
      console.log("%c > Speech recognition accessible", "color: red; font-weight: 600;"); // eslint-disable-line
      const commands = {
        "test": () => {
          this.setState({ command: "test" });
        },
        "(montre-moi) la météo": () => {
          openMeteo(true);
        },
        "ferme la météo": () => {
          openMeteo(false);
        },
        "(montre-moi les) horaires de bus": () => {
          openBus(true);
        },
        "ferme les horaires de bus": () => {
          openBus(false);
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
        "pause": () => {
          this.setState({ command: "Stop" });
          this.player && this.player.pause();
        },
        "play": () => {
          this.setState({ command: "Resume" });
          this.player && this.player.resume();
        },
        "suivant": () => {
          this.setState({
            command: "Next",
            previousTrack: null,
            nextTrack: null,
          }, () => this.player && this.player.nextTrack() && this.carouselTracks.updateRandomGradient());
        },
        "précédent": () => {
          this.setState({
            command: "Previous",
            previousTrack: null,
            nextTrack: null,
          }, () => this.player && this.player.previousTrack() && this.carouselTracks.updateRandomGradient());
        },
        "avance": () => {
          this.setState({ command: "Seek" });
          this.player && this.player.seek(1000 * 60); // Move to 1 min
        },
        "recule": () => {
          this.setState({ command: "Reset" });
          this.player && this.player.seek(0);  
        },
        "*anything": anything => this.setState({ command: anything })
      };
      annyang.addCommands(commands);
      annyang.setLanguage("fr-FR");
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
      });
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
      });
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
    this.player.addListener("initialization_error", ({ message }) => { console.error(message); });
    this.player.addListener("authentication_error", ({ message }) => { console.error("Failed to authenticate account", message); });
    this.player.addListener("account_error", ({ message }) => { console.error(message); });
    this.player.addListener("playback_error", ({ message }) => { console.error(message); });
  
    // Playback status updates
    this.player.addListener("player_state_changed", statePlayer => {
      this.setState({
        currentTrack: statePlayer.track_window && statePlayer.track_window.current_track,
        previousTrack: statePlayer.track_window && statePlayer.track_window.previous_tracks && statePlayer.track_window.previous_tracks[0],
        nextTrack: statePlayer.track_window && statePlayer.track_window.next_tracks && statePlayer.track_window.next_tracks[0]
      });
    });
  
    // Ready
    /* eslint-disable-next-line camelcase */
    this.player.addListener("ready", ({ device_id }) => { console.log("Ready with Device ID", device_id); });
  
    // Not Ready
    /* eslint-disable-next-line camelcase */
    this.player.addListener("not_ready", ({ device_id }) => console.log("Device ID has gone offline", device_id));
  
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
    const { currentTrack, previousTrack, nextTrack, command } = this.state;

    const cover = currentTrack && getCover(currentTrack);

    return (
      <div className={styles.group}>
        {/* <button onClick={() => this.launchSong("david bowie")}>Play - David Bowie</button> */}
        {currentTrack && (
          <section className="spotify">
            <div className="spotify__player txt__white">
              <h2 className="spotify__player__head">
                <span className="youre-listening-to">Vous écoutez</span>
                <br/>
                {getTrackName(currentTrack)} - {
                  getArtists(currentTrack).length > 1
                    ? getArtists(currentTrack).map((artist, index) => (
                      <span key={`artist-${artist}`}>{index !== 0 && " & "}{artist}</span>
                    ))
                    : <span>{getArtists(currentTrack)[0]}</span>}
                <p>{getDuration(currentTrack)}</p>
              </h2>
              <CarouselTracks
                ref={el => this.carouselTracks = el}
                cover={cover}
                previousTrack={previousTrack}
                nextTrack={nextTrack}
              />
            </div>
          </section>
        )}
        <section className={`${styles.vocal} vocal`}>
          <p>{command || "Ask something..."}</p>
        </section>
      </div>
    );
  }
}

Vocal.propTypes = {
  openBus: PropTypes.func,
  openMeteo: PropTypes.func
};
Vocal.defaultProps = {
  openBus: () => {},
  openMeteo: () => {}
};

export default Vocal;
