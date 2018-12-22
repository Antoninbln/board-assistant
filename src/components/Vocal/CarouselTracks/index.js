import React from "react";
import { getArtists, getCover, getTrackName } from "../../utils/fetchSpotify";

import styles from "./index.module.scss";

const CarouselTracks = ({ cover, previousTrack, nextTrack }) => (
  <div className='spotify__carousel'>
    {previousTrack
      ? (
        <img className="spotify__carousel__besideTrack previousTrack" src={getCover(previousTrack)} alt="Cover previous track" />
      ) : (
        <div className="spotify__carousel__besideTrack noCover previousTrack"></div>
      )
    }
    {cover ? <img className="spotify__carousel__currentTrack" src={cover} alt="Pochette d'album" /> : <p>No cover available</p>}
    {nextTrack
      ? (
        <img className="spotify__carousel__besideTrack nextTrack" src={getCover(nextTrack)} alt="Cover next track" />
      ) : (
        <div className="spotify__carousel__besideTrack noCover nextTrack"></div>
      )
    }
  </div>
);

export default CarouselTracks;
