const clientId = 'usg4v0i9m8c8ow94fj7w1w8jrywo9k';
const clientSecret = 'khcxdmodyqxoajyybl0mguqzmqjb6m';

const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`

// {
//     "access_token": "g62m6nffxtjyglauttx17u3j286ara",
//     "expires_in": 5547325,
//     "token_type": "bearer"
// }


const topStreamsUrl = 'https://api.twitch.tv/helix/streams';