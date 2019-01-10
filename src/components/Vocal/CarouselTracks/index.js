import React, { Component } from "react";
import { getArtists, getCover, getTrackName } from "../../utils/fetchSpotify";

import styles from "./index.module.scss";

const GRADIENTS = [
  { color1: "#FC466B", color2: "#3F5EFB" },
  { color1: "#fc5c7d", color2: "#6a82fb" },
  { color1: "#FC354C", color2: "#0ABFBC" },
  { color1: "#c31432", color2: "#240b36" },
  { color1: "#00b09b", color2: "#96c93d" },
  { color1: "#16a085", color2: "#f4d03f" },
];

class CarouselTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomGradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    }
  }

  updateRandomGradient() {
    this.setState({ randomGradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)] });
  }

  render() {
    const { cover, previousTrack, nextTrack } = this.props;
    const { color1, color2 } = this.state.randomGradient;
    const linear = { background: `${color1}`, background: `linear-gradient(45deg, ${color1}, ${color2})` };

    return (
      <div>
        <div className='spotify__carousel'>
          <div className="spotify__carousel__beside-container">
            {previousTrack
              ? (
                <img className="spotify__carousel__beside-container__track" src={getCover(previousTrack)} alt="Cover previous track" />
              ) : (
                <div className="spotify__carousel__beside-container__track no-cover" />
              )
            }
            {nextTrack
              ? (
                <img className="spotify__carousel__beside-container__track" src={getCover(nextTrack)} alt="Cover next track" />
              ) : (
                <div className="spotify__carousel__beside-container__track no-cover" />
              )
            }
          </div>
          {cover
            ? (
              <img className="spotify__carousel__currentTrack" src={cover} alt="Pochette d'album" />
            ) : (
              <div className="spotify__carousel__currentTrack noCurrentCover" style={linear} />
            )
          }
        </div>
        {cover
          ? (
            <div className="spotify__carousel__bg" style={{ backgroundImage: `url(${cover})` }} />
          ) : (
            <div className="spotify__carousel__bg" style={linear} />
          )
        }
      </div>
    )
  }
}

export default CarouselTracks;
