const library = (function() {

  function updateHistory(stream) {
    const userName = stream.user_name ? stream.user_name : stream.display_name;
    const viewingHistory = document.getElementById('history-content');
    const twitchStreamUrl = "https://twitch.tv/" + userName;
    const historyItem = document.createElement('div');
 
    if (stream.game_name) {
      stream.game_name = ` | ${stream.game_name}`
    }

    historyItem.innerHTML = `
      <div class="ui fluid card">
        <div class="content">
          <div id="history-header" class="header"><a href=${twitchStreamUrl} target="_blank">${userName}</a>${stream.game_name || ''}</div>
          <div id="history-description" class="description">${stream.title}</div>
        </div>
      </div>`

    viewingHistory.prepend(historyItem);
  }

  function embedTwitch(randomStream) {
    if (randomStream) {
      updateHistory(randomStream);
    }

    let options = {
      width: '100%',
      height: '93%',
      muted: false,
      autoplay: true,
      theme: localStorage.getItem('darkMode'),
      channel: randomStream.user_name || randomStream.display_name,
      parent: ['localhost'],
    }

    if (localStorage.getItem('videoChat') === 'video-only') {
      options.layout = 'video'
      darkModeToggle.style.visibility = 'hidden'
    } else {
      delete options.layout
      darkModeToggle.style.visibility = 'visible'
    }

    new Twitch.Embed('twitch-embed', options);
}
  
  function populateLanguageDropdown() {
    let languageArr = Object.entries(languages);
    languageArr.sort((a,b) => a[1].localeCompare(b[1]));
    languageArr.forEach(el => {
      let newLanguageItem = document.createElement('div');
      newLanguageItem.classList.add('item');
      newLanguageItem.setAttribute('data-value', el[0])
      newLanguageItem.innerText = el[1];
      
      languageMenu.appendChild(newLanguageItem);
    });
  }

  function refreshMainContent() {
    if (welcomeCard) {
      welcomeCard.remove();
    }

    if (document.getElementById('error-card')) {
      document.getElementById('error-card').remove();
    }
    
    if (document.getElementsByTagName('iframe').length) {
      document.getElementsByTagName('iframe')[0].remove();
    }
    
    if (localStorage.getItem('videoChat') === 'video-with-chat') {
      darkModeToggle.style.visibility = 'visible';
    }
    
    chatToggle.style.visibility = 'visible'
  }

  function showError() {
    let errorWrapper = document.createElement('div');
    errorWrapper.className = 'ui card';
    errorWrapper.id = 'error-card';

    const errorMessage = `
    <div class="content">
      <div class="ui medium header">
        Sorry, something went wrong.
      </div>
      <p>Please Try Again.</p>
    </div>`;

    errorWrapper.innerHTML = errorMessage;

    if (document.getElementById('loader')) {
      document.getElementById('loader').remove();
    }

    mainContent.appendChild(errorWrapper);
  }

  function toggleDarkMode() {
    let iframe = document.getElementsByTagName('iframe')[0];

    if (iframe.src.indexOf('dark') === -1 ) {
      iframe.src = iframe.src.replace(/light/g, 'dark');
      localStorage.setItem('darkMode', 'dark');
    } else {
      iframe.src = iframe.src.replace(/dark/g, 'light');
      localStorage.setItem('darkMode', 'light');
    }
  }

  function toggleVideoChat() {
    let iframe = document.getElementsByTagName('iframe')[0];

    if (localStorage.getItem('videoChat') === 'video-with-chat') {
      localStorage.setItem('videoChat', 'video-only')
      darkModeToggle.style.visibility = 'hidden'
      iframe.src += '&layout=video'
    } else {
      localStorage.setItem('videoChat', 'video-with-chat')
      iframe.src = iframe.src.replace(/&layout=video/g, '')
      darkModeToggle.style.visibility = 'visible'
    }
  }
  
  const throttle = (func, limit) => {
    let inThrottle
    return (...args) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  return {
    embedTwitch,
    populateLanguageDropdown,
    refreshMainContent,
    showError,
    throttle,
    toggleDarkMode,
    toggleVideoChat,
  };
})();


