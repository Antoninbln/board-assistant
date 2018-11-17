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
  console.log("TOKEN", accessToken)
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
      return body.tracks.items[0].uri;
    });
  return result;
}

// export const search = (query, accessToken) => {
//   console.log("TOKEN", accessToken)
//   let result = fetch(`https://api.spotify.com/v1/search?q=${encodeURI(query)}&type=track`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${accessToken}`
//     }})
//     .then(res => res.json())
//     .then(body => {
//       console.log(body.tracks.items[0]);
//       return body.tracks.items[0].uri;
//     });
//   return result;
// }