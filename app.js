const clientId = 'usg4v0i9m8c8ow94fj7w1w8jrywo9k';
const clientSecret = 'khcxdmodyqxoajyybl0mguqzmqjb6m';

const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
const topStreamsUrl = 'https://api.twitch.tv/helix/streams?first=100';

let access_token = 'xo0t4ahhetbujy7qvyx5jjf078e00p'
let streams;

function getAccessToken() {
  const request = new Request(tokenUrl, { method: 'POST' });

  fetch(request).then((response) => response.json())
    .then((responseJson) => { 
      access_token = responseJson.access_token;
    }).catch((error) => { 
      console.error(error);
    });
}

function getTopStreams() {
  const request = new Request(topStreamsUrl, { 
    method: 'GET' ,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  });

  fetch(request).then((response) => response.json())
    .then((responseJson) => { 
      streams = responseJson.data;
    }).catch((error) => { 
      console.error(error);
    });
}

function getRandomStream(streams) {
  let randomStream = streams[Math.floor(Math.random()*streams.length)];
  return randomStream.user_name;
}

function embedStream() {
  new Twitch.Embed("twitch-embed", {
    width: 800,
    height: 500,
    channel: 'dakotaz',
    parent: ['localhost']
  });
}

// function init() {
//   getAccessToken()
// }

// init()