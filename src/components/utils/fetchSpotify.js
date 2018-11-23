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
      'Authorization': `Bearer ${accessToken}`,
    }})
    .then(res => res.json())
    .then(body => body.tracks.items.map(item => item.uri));
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
  accessToken,
}) => {
  console.log(spotify_uri);
  getOAuthToken(() => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: spotify_uri }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
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
      'Authorization': `Bearer ${accessToken}`,
    }})
    .then(res => res.json())
    .then(body => body.albums.items[0]);
  return result;
};

/**
 * 
 */
export const getHashParams = () => {
  let hashParams = {};
  let regE = /([^&;=]+)=?([^&;]*)/g;
  const regR = /([^&;=]+)=?([^&;]*)/g;

  const q = window.location.hash.substring(1);

  regE = regR.exec(q)

  while (regE) {
    hashParams[regE[1]] = decodeURIComponent(regE[2]);
    regE = regR.exec(q);
  }

  return hashParams;
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

/**
 * Return cover url
 * @param { Object } track
 * @return { String } Cover url
 */
export const getCover = track => {
  const cover = track.album && track.album.images && track.album.images.find(image => image.height === 640);

  if (!cover) {
    console.error("Can't find a cover for this track");
    return null;
  }
  return cover.url;
};

export const getNewAccessToken = refreshToken => {
  console.log("asking new access token");
  let result = fetch(`http://localhost:8888/refresh_token`)
    .then((res, err) => {
      if (err) throw new Error(err);
      return res.json()
    })
    .then(body => {
      console.log("new token body", body);
      return body;
    });
    // .catch(err => {
    //   console.error("Something went wrong when u tried to refresh token", err)
    // });

  return result;

  // app.get('/refresh_token', function(req, res) {

  //   // requesting access token from refresh token
  //   var refresh_token = req.query.refresh_token;
  //   var authOptions = {
  //     url: 'https://accounts.spotify.com/api/token',
  //     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
  //     form: {
  //       grant_type: 'refresh_token',
  //       refresh_token: refresh_token
  //     },
  //     json: true
  //   };
  
  //   request.post(authOptions, function(error, response, body) {
  //     if (!error && response.statusCode === 200) {
  //       var access_token = body.access_token;
  //       res.send({
  //         'access_token': access_token
  //       });
  //     }
  //   });
  // });
};
