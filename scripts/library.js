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
          <div class="description">${stream.title}</div>
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
      video: localStorage.getItem('videoChat'),
      theme: localStorage.getItem('darkmode'),
      channel: randomStream.user_name || randomStream.display_name,
      parent: ['localhost'],
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

    darkModeToggle.style['visibility'] = 'visible';
    document.getElementById('hide-chat-toggle').style['visibility'] = 'visible';
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
    </div>`

    errorWrapper.innerHTML = errorMessage

    mainContent.appendChild(errorWrapper);
  }

  function toggleDarkMode() {
    let iframe = document.getElementsByTagName('iframe')[0];

    if (iframe.src.indexOf('dark') === -1 ) {
      iframe.src = iframe.src.replace(/light/g, 'dark');
      localStorage.setItem('darkmode', 'dark');
    } else {
      iframe.src = iframe.src.replace(/dark/g, 'light');
      localStorage.setItem('darkmode', 'light');
    }
  }

  function toggleVideoChat() {
    let iframe = document.getElementsByTagName('iframe')[0];

    if (iframe.src.indexOf('layout') === -1) {
      iframe.src += '&layout=video';
      localStorage.setItem('videoChat', 'video-with-chat');
      darkModeToggle.style['visibility'] = 'hidden';
    } else {
      iframe.src = iframe.src.replace(/&layout=video/g, '');
      localStorage.setItem('videoChat', 'video');
      darkModeToggle.style['visibility'] = 'visible';
    }
  }

  return {
    embedTwitch,
    populateLanguageDropdown,
    refreshMainContent,
    showError,
    toggleDarkMode,
    toggleVideoChat,
  };
})();