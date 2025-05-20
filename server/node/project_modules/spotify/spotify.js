const fetch = require('node-fetch');
require('dotenv').config();

async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  return data.access_token;
}

async function searchSpotifyTrack(trackName) {
  const token = await getSpotifyToken();
  const encodedQuery = encodeURIComponent(trackName);
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&include_external=audio`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!data.tracks || !data.tracks.items) return [];
  return data.tracks.items.map(track => ({
    songName: track.name,
    artistName: track.artists && track.artists.length > 0 ? track.artists[0].name : '',
    albumArt: track.album && track.album.images && track.album.images.length > 0 ? track.album.images[0].url : ''
  }));
}

module.exports = { searchSpotifyTrack };