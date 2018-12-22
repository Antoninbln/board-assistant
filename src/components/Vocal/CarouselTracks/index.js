import React from "react";
import { getArtists, getCover, getTrackName } from "../../utils/fetchSpotify";

import styles from "./index.module.scss";

const CarouselTracks = ({ cover, previousTrack, nextTrack, color1, color2 }) => (
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
        <div
          className="spotify__carousel__currentTrack noCurrentCover"
          style={{ background: `${color1}`, background: `linear-gradient(to bottom, ${color1}, ${color2})` }}
        />
      )
    }
  </div>
);

export default CarouselTracks;
