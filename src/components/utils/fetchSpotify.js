import moment from "moment";

/**
 * Request SEARCH for a song
 * @param { String } query
 * @param { String } accessToken
 * @return { Void }
 */
export const searchSong = (query, accessToken) => {
  let result = fetch(`https://api.spotify.com/v1/search?q=${encodeURI(query)}&type=track`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }})
    .then(res => res.json())
    .then(body => {
      console.log(body.tracks.items.map(item => item.uri));
      return body.tracks.items.map(item => item.uri);
    });
  return result;
};

/**
 * Request PLAY for a song
 * @param { Oobject } param : { playerInstance: <Object>, accessToken: String }
 * @return { Void }
 */
export const playSong = ({
  spotify_uri,
  playerInstance: {
    _options: {
      getOAuthToken,
      id,
    },
  },
  accessToken
}) => {
  console.log(spotify_uri);
  getOAuthToken(() => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: spotify_uri }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
  });
};

/**
 * Request SEARCH for an album
 * @param { String } query
 * @param { String } accessToken
 * @return { Void }
 */
export const searchAlbum = (query, accessToken) => {
  let result = fetch(`https://api.spotify.com/v1/search?q=${encodeURI(query)}&type=album`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }})
    .then(res => res.json())
    .then(body => {
      console.log(body.albums.items[0]);
      return body.albums.items[0];
    });
  return result;
};

// /**
//  * Request REFRESH token for a song
//  * @param { String } query
//  * @param { String } accessToken
//  * @return { Void }
//  */
// export const getAccessToken = (query, accessToken) => {
//   let result = fetch(`https://accounts.spotify.com/api/token`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${accessToken}`
//     }})
//     .then(res => res.json())
//     .then(body => {
//       console.log(body.tracks.items.map(item => item.uri));
//       return body.tracks.items.map(item => item.uri);
//     });
//   return result;
// };

// /**
//  * Request PLAY for an album
//  * @param { Oobject } param : { playerInstance: <Object>, accessToken: String }
//  * @return { Void }
//  */
// export const playAlbum = ({
//   spotify_uri,
//   playerInstance: {
//     _options: {
//       getOAuthToken,
//       id
//     }
//   },
//   accessToken
// }) => {
//   getOAuthToken(() => {
//     fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
//       method: 'PUT',
//       body: JSON.stringify({ uris: [spotify_uri] }),
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`
//       },
//     });
//   });
// };

/**
 * Set on Pause current song
 * @param { Oobject } param : { playerInstance: <Object>, accessToken: String }
 * @return { Void }
 */
export const stopSong = ({
  playerInstance: {
    _options: {
      getOAuthToken,
      id
    }
  },
  accessToken
}) => {
  getOAuthToken(() => {
    fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${id}`, {
      method: 'PUT',
      // body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
  });
};

/**
 * Set on Resume current song
 * @param { Oobject } param : { playerInstance: <Object>, accessToken: String }
 * @return { Void }
 */
export const resumeSong = ({
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
      // body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
  });
};


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
