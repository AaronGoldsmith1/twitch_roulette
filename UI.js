function populateLanguageDropdown() {
   for (let key in LANGUAGES_LIST) {
    let newLanguageItem = document.createElement('div')
    newLanguageItem.classList.add('item')
    newLanguageItem.setAttribute('data-value', key)
    newLanguageItem.innerText = LANGUAGES_LIST[key];
    
    languageMenu.appendChild(newLanguageItem)
  }
}

function refreshMainContent() {
  if (welcomeCard) {
    welcomeCard.remove();
  }
  
  if (document.getElementsByTagName('iframe').length) {
    document.getElementsByTagName('iframe')[0].remove();
  }

  darkModeToggle.style['visibility'] = 'visible';
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

const UI = {
  populateLanguageDropdown,
  refreshMainContent, 
  toggleDarkMode
};

