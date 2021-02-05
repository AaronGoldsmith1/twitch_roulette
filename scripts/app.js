const clientId = 'usg4v0i9m8c8ow94fj7w1w8jrywo9k';
const clientSecret = 'khcxdmodyqxoajyybl0mguqzmqjb6m';

const searchStreamsUrl = `https://api.twitch.tv/helix/search/channels?live_only=true&first=100&query=`
const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
const topCategoriesUrl = 'https://api.twitch.tv/helix/games/top?first=100';
const topStreamsUrl = 'https://api.twitch.tv/helix/streams?first=100';
const topTagsUrl = 'https://api.twitch.tv/helix/tags/streams?first=100';

const categoryMenu = document.getElementById('category-menu');
const chatToggle = document.getElementById('chat-toggle');
const darkModeToggle = document.getElementById('darkmode-toggle');
const categoryDropdown = document.getElementsByClassName('filter-menu')[0]
const tagDropdown = document.getElementsByClassName('filter-menu')[1]
const languageMenu = document.getElementById('language-menu');
const mainContent = document.getElementById('main-content');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const spinButtons = document.querySelectorAll('.spin');
const tagMenu = document.getElementById('tag-menu');
const welcomeCard = document.getElementById('welcome-card');

const { 
  embedTwitch, 
  populateLanguageDropdown, 
  refreshMainContent, 
  showError, 
  toggleDarkMode, 
  toggleVideoChat,
} = library;

let access_token, searchEndpoint, searchQuery;

async function getAccessToken() {
  const request = new Request(tokenUrl, { method: 'POST' });

  try {
    const response = await fetch(request);
    const responseJson = await response.json();
    access_token = responseJson.access_token;
  } catch {
    showError();
  }
}

function getAllStreams (cursor, data = [], counter = 35) {
  while (counter !== 0) {
    const request = new Request(topStreamsUrl + '&language=en'  + (cursor ? '&after=' + cursor : ''), { 
    method: 'GET' ,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
      return fetch(request).then((response) => response.json()).then((responseJson) => { 
        if (counter === 1) return data;
        data.push(...responseJson.data);
        return getAllStreams(responseJson.pagination.cursor, data, --counter);
    }).catch(showError);
  }
}

function getTopStreams() {
  let loader = document.createElement('div');
  loader.id = 'loader';
  loader.className = 'ui huge active centered inline loader';
  mainContent.appendChild(loader);

  getAllStreams().then(function(allStreams) {
    let randomStream = allStreams[Math.floor(Math.random()*allStreams.length)];
    mainContent.removeChild(loader);
    embedTwitch(randomStream);
  });
}

function getStreamTags() {
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
      let tags = responseJson.data.map(tag => tag.localization_names['en-us']).sort();
      tags.forEach(function(tag) {
        let newTagItem = document.createElement('div');
        newTagItem.classList.add('item');
        newTagItem.setAttribute('data-value', tag);
        newTagItem.innerText = tag;
        tagMenu.appendChild(newTagItem)
      })
    });
}

function getStreamCategories() {
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
      let categories = responseJson.data;
      categories.forEach(function(category, idx) {
        let newCategoryItem = document.createElement('div');
        newCategoryItem.classList.add('item');
        newCategoryItem.setAttribute('data-value', category.id);
        newCategoryItem.innerText = `${idx + 1}. ${category.name}`;
        categoryMenu.appendChild(newCategoryItem);
      });
    });
}

function getStreamsByLanguage(language) {
  const request = new Request(topStreamsUrl  + `&language=${language}`, { 
    method: 'GET' ,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
    
    fetch(request).then((response) => response.json()).then((responseJson) => { 
      let allStreams = responseJson.data;
      let randomStream = allStreams[Math.floor(Math.random()*allStreams.length)];
      embedTwitch(randomStream);
    }).catch(getTopStreams);
}

function getStreamsByCategory(categoryId) {
  const request = new Request(topStreamsUrl  + `&language=en&game_id=${categoryId}`, { 
    method: 'GET' ,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`,
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
    
    fetch(request).then((response) => response.json()).then((responseJson) => { 
      let allStreams = responseJson.data;
      let randomStream = allStreams[Math.floor(Math.random()*allStreams.length)];
      embedTwitch(randomStream);
    }).catch(getTopStreams);
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
      let randomStream = streams[Math.floor(Math.random()*streams.length)];
      embedTwitch(randomStream);
    }).catch(getTopStreams);
}



const throttled = throttle(function() {
      refreshMainContent();
      getTopStreams();
    }, 9000)



function init() {
  getAccessToken().then(getStreamTags).then(getStreamCategories);

  searchButton.addEventListener('click', function() {
    if (searchInput.value) {
      refreshMainContent();
      searchStreams();
      searchInput.value = '';
    }
  })

  spinButtons.forEach(function(button) {
    button.addEventListener('click', throttled)
  })

  categoryDropdown.addEventListener('click', function(e) {
    refreshMainContent();
    getStreamsByCategory(parseInt(e.target.dataset.value));
  });

  tagDropdown.addEventListener('click', function(e) {
    refreshMainContent();
    searchStreams(e.target.dataset.value);
  })

 document.body.addEventListener('click', function() {
    if (document.getElementsByClassName('clear')[0]) {
      document.getElementsByClassName('clear')[0].click();
    }
  });

  languageMenu.addEventListener('click', function(e) {
    refreshMainContent();
    getStreamsByLanguage(e.target.dataset.value);
  });

  document.getElementsByTagName('form')[0].addEventListener('submit', function(e) {
    e.preventDefault();
  })

  document.getElementById('darkmode-checkbox').addEventListener('click', toggleDarkMode);
  localStorage.setItem('darkMode', 'light');
  
  document.getElementById('chat-checkbox').addEventListener('click', toggleVideoChat)
  localStorage.setItem('videoChat', 'video-with-chat')
  
  populateLanguageDropdown();
}

init();

