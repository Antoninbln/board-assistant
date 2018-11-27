/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const env = require('dotenv').config();

const client_id = process.env.CLIENT_ID; // process.env.client_id; // Your client id
const client_secret = process.env.CLIENT_SECRET; //process.env.client_secret; // Your secret
const redirect_uri = process.env.REDIRECT_URI; //process.env.redirect_uri; // Your redirect uri
const port = 8888;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';
const app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // Request authorization
  const scope = 'user-read-private user-read-email streaming playlist-read-private';
  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  }`);
});

app.get('/callback', (req, res) => {
  // Request refresh and access tokens
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${
      querystring.stringify({ error: 'state_mismatch' })
    }`);

  } else {
    res.clearCookie(stateKey);

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': `Basic ${new Buffer(client_id + ':' + client_secret).toString('base64')}`
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        // Send token to the new URL
        res.redirect(`http://localhost:3000/#${
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          })
        }`);

      } else {
        res.redirect(`/#${
          querystring.stringify({ error: 'invalid_token' })
        }`);
      }
    });
  }
});

app.get('/refresh_token', (req, res) => {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  let access_token = req.query.access_token || null;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': `Basic ${new Buffer(client_id + ':' + client_secret).toString('base64')}`
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;

      res.send({
        'access_token': access_token
      });
    } else if (error) return error;
  });
});

app.get("/ask-access-token", (req, res) => {
  res.send({
    "access_token": access_token,
    "refresh_token": refresh_token
  });
});

console.log(`Listening on ${port}`);

app.listen(port);
