import React from "react";
import PropTypes from "prop-types";

import { getArtists, getCover, getTrackName } from "utils/fetchSpotify";

import styles from "./index.module.scss";

const BesideTrack = ({ track, isNext, className }) => (
  <div className={`spotify__beside-track ${styles.group} ${className} ${ isNext ? `${styles.reversed} reversed` : "" }`}>
    <div className={`img-container ${ isNext ? "reversed" : "" }`}>
      <img src={getCover(track)} alt="Cover next track" />
    </div>
    <div className="content-container">
      <h3>{getTrackName(track)}</h3>
      <p>
        {getArtists(track).length > 0
          ? getArtists(track).map((item, index) => <span key={`artist-${index}`}>{!index === 0 && " & "}{item}</span>)
          : <span>{getArtists(track)[0]}</span>
        }
      </p>
    </div>
  </div>
);

BesideTrack.propTypes = {
  track: PropTypes.shape({}),
  isNext: PropTypes.bool,
  className: PropTypes.string
};

BesideTrack.defaultProps = {
  track: {},
  isNext: false,
  className: ""
};

export default BesideTrack;