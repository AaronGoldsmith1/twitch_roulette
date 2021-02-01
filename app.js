const clientId = 'usg4v0i9m8c8ow94fj7w1w8jrywo9k';
const clientSecret = 'khcxdmodyqxoajyybl0mguqzmqjb6m';

const searchStreamsUrl = `https://api.twitch.tv/helix/search/channels?live_only=true&first=100&query=`
const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
const topCategoriesUrl = 'https://api.twitch.tv/helix/games/top?first=100';
const topStreamsUrl = 'https://api.twitch.tv/helix/streams?first=100';
const topTagsUrl = 'https://api.twitch.tv/helix/tags/streams?first=100';

let access_token;
let searchEndpoint;
let searchQuery;

const categoryMenu = document.getElementById('category-menu');
const dropdowns = document.getElementsByClassName('filter-menu')
const searchButton = document.getElementById('search-button');
const tagMenu = document.getElementById('tag-menu');
const searchInput = document.getElementById('search-input');
const spinButtons = document.querySelectorAll('.spin');
const welcomeCard = document.getElementById('welcome-card');

async function getAccessToken() {
  const request = new Request(tokenUrl, { method: 'POST' });

  try {
    const response = await fetch(request);
    const responseJson = await response.json();
    access_token = responseJson.access_token;
  } catch (error) {
    console.error(error);
  }
}

function getTopStreams() {
  getAllStreams().then(function(allStreams) {
    let randomStream = allStreams[Math.floor(Math.random()*allStreams.length)].user_name;
    console.log(allStreams)
    new Twitch.Embed('twitch-embed', {
      width: '100%',
      height: '96%',
      theme: 'dark',
      channel: randomStream,
      parent: ['localhost']
    });
  });
}

function searchStreams(searchQuery) {
  searchQuery = searchQuery ? searchQuery : searchInput.value;
  searchEndPoint = searchStreamsUrl + searchQuery;

  const request = new Request(searchEndPoint, { 
    method: 'GET' ,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  });

  fetch(request).then(response => response.json())
    .then((responseJson) => { 
      let streams = responseJson.data;
      let randomStream = streams[Math.floor(Math.random()*streams.length)]?.display_name;
      
      new Twitch.Embed('twitch-embed', {
        width: '100%',
        height: '96%',
        theme: 'dark',
        channel: randomStream,
        parent: ['localhost']
      });
    }).catch((error) => { 
      getTopStreams()
      console.error(error);
    });
    if  (document.getElementsByClassName('clear')[0]) {
      document.getElementsByClassName('clear')[0].click()
    }
  
}

function initTagDropDown() {
  const request = new Request(topTagsUrl, { 
    method: 'GET' ,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  });

  return fetch(request).then((response) => response.json())
    .then((responseJson) => { 
      let tags = responseJson.data.map(tag => tag.localization_names['en-us']).sort()
      tags.forEach(function(tag) {
        let newTagItem = document.createElement('div')
        newTagItem.classList.add('item')
        newTagItem.setAttribute('data-value', tag)
        newTagItem.innerText = tag;

        tagMenu.appendChild(newTagItem)
      })
    }).catch((error) => { 
      console.error(error);
    });

}

function initCategoriesDropDown() {
  const request = new Request(topCategoriesUrl, { 
    method: 'GET' ,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  });

  fetch(request).then((response) => response.json())
    .then((responseJson) => { 
      let categories = responseJson.data.map(category => category.name)
      categories.forEach(function(category, idx) {
        let newCategoryItem = document.createElement('div')
        newCategoryItem.classList.add('item')
        newCategoryItem.setAttribute('data-value', category)
        newCategoryItem.innerText = `${idx + 1}. ${category}`;

        categoryMenu.appendChild(newCategoryItem)
      })
    }).catch((error) => { 
      console.error(error);
    });

}

function refreshMainContent() {
  if (welcomeCard) {
    welcomeCard.remove();
  }
  
  if (document.getElementsByTagName('iframe').length) {
    document.getElementsByTagName('iframe')[0].remove();
  }
}

function init() {
  getAccessToken().then(initTagDropDown).then(initCategoriesDropDown)

  searchButton.addEventListener('click', function(e) {
    if (searchInput.value) {
      refreshMainContent()
      searchStreams();
      searchInput.value = '';
    }
  })

  spinButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      refreshMainContent()
      getTopStreams()
    })
  })

   Array.from(dropdowns).forEach(function(element) {
      element.addEventListener('click', function(e) {
        refreshMainContent()
        searchStreams(e.target.dataset.value)
      });
    });

  document.getElementsByTagName('form')[0].addEventListener('submit', function(e) {
    e.preventDefault()
  })

  document.body.addEventListener('click', function() {
    if  (document.getElementsByClassName('clear')[0]) {
      document.getElementsByClassName('clear')[0].click()
    }
  });
}

init()

async function getAllStreams (cursor, data = [], counter=10) {
  while (counter !== 0) {
    const request = new Request(topStreamsUrl  + (cursor ? '&after=' + cursor : ''), { 
    method: 'GET' ,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
     return await fetch(request).then((response) => response.json()).then((responseJson) => { 
      if (counter === 1 ) return data;
      data.push(...responseJson.data);
      console.log(responseJson.pagination.cursor)
      return getAllStreams(responseJson.pagination.cursor, data, --counter);
    }).catch((error) => { 
      console.error(error);
    });
  }
}

