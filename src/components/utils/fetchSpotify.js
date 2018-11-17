import moment from "moment";

export const playSong = ({
  spotify_uri,
  playerInstance: {
    _options: {
      getOAuthToken,
      id
    }
  },
  accessToken
}) => {
  getOAuthToken(() => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
  });
};

export const search = (query, accessToken) => {
  let result = fetch(`https://api.spotify.com/v1/search?q=${encodeURI(query)}&type=track`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }})
    .then(res => res.json())
    .then(body => {
      console.log(body.tracks.items[0]);
      return body.tracks.items[0];
    });
  return result;
}

/**
 * Return list of Artists name
 * @param { Object } track
 * @return { array<String> }
 */
export const getArtists = track => track.artists.map(artist => artist.name);

/**
 * Return Track name
 * @param { Object } track
 * @return { String }
 */
export const getTrackName = track => track.name;

/**
 * Return duration of Song
 * @param { Object } track
 * @return { String }
 */
export const getDuration = track => moment(track.duration_ms).format("mm:ss");

export const getCover = track => {
  const cover = track.album && track.album.images && track.album.images.find(image => image.height === 640);

  if (!cover) {
    console.error("Can't find a cover for this track");
    return null;
  }
  return cover.url;
}
