(function(){
  $('.ui.dropdown').dropdown({
    clearable: true,
    keys: { 
      enter: '',
      upArrow: '',
      downArrow: ''
    },
    forceSelection: false,
    fullTextSearch: true, 
    selected: true
  });

  $('#history-button').click(function(){
    $('.ui.modal').modal('show');
  })

  //ios keyboard moving content fix
  $('input').on('focus', function(e) {
    e.preventDefault(); e.stopPropagation();
    window.scrollTo(0,0); 
});

})();


