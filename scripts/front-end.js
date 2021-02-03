const UI = (function() {

  function updateHistory(stream) {
    const viewingHistory = document.getElementById('history-content');
    const twitchStreamUrl = "https://twitch.tv/" + stream.user_name;
   
    viewingHistory.innerHTML += `
      <div class="ui fluid card">
        <div class="content">
          <div id="history-header" class="header"><a href=${twitchStreamUrl} target="_blank">${stream.user_name}</a> | ${stream.game_name}</div>
          <div class="description">${stream.title}</div>
        </div>
      </div>`;
  }

  function embedTwitch(randomStream) {
    if (randomStream) {
      updateHistory(randomStream);
    }

    let options = {
      width: '100%',
      height: '93%',
      theme: localStorage.getItem('darkmode'),
      channel: randomStream.user_name || randomStream.display_name,
      parent: ['localhost']
    }

    if (!localStorage.getItem('videoChat')) {
      options['layout'] = 'video'
      } else {
        delete options['layout'];
      }
  
    new Twitch.Embed('twitch-embed', options);
}
  
  function populateLanguageDropdown() {
    let languageArr = Object.entries(languages)
    languageArr.sort((a,b) => a[1].localeCompare(b[1]))
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
    
    if (document.getElementsByTagName('iframe').length) {
      document.getElementsByTagName('iframe')[0].remove();
    }

    darkModeToggle.style['visibility'] = 'visible';
    document.getElementById('hide-chat-toggle').style['visibility'] = 'visible';
  }

  function toggleDarkMode() {
    let iframe = document.getElementsByTagName('iframe')[0]

    if (iframe.src.indexOf('dark') === -1 ) {
      iframe.src = iframe.src.replace(/light/g, 'dark')
      localStorage.setItem('darkmode', 'dark');
    } else {
      iframe.src = iframe.src.replace(/dark/g, 'light')
      localStorage.setItem('darkmode', 'light')
    }
  }

  function toggleVideoChat() {
    let iframe = document.getElementsByTagName('iframe')[0]

    if (iframe.src.indexOf('layout') === -1) {
      iframe.src += '&layout=video'
      localStorage.setItem('videochat', false);
      darkModeToggle.style['visibility'] = 'hidden';
    } else {
      iframe.src = iframe.src.replace(/&layout=video/g, '')
      localStorage.setItem('videochat', true);
      darkModeToggle.style['visibility'] = 'visible';
    }
  }

  return {
    embedTwitch,
    populateLanguageDropdown,
    refreshMainContent, 
    toggleDarkMode,
    toggleVideoChat,
  };
})();


//video only

//https://embed.twitch.tv?channel=Chenzo&height=93%25&layout=video&migration=true&parent=localhost&parent=127.0.0.1&referrer=http%3A%2F%2F127.0.0.1%3A5500%2Findex.html&theme=light&width=100%25


// video with chat

//https://embed.twitch.tv?channel=Razerninjas&height=93%25&migration=true&parent=localhost&parent=127.0.0.1&referrer=http%3A%2F%2F127.0.0.1%3A5500%2Findex.html&theme=light&width=100%25