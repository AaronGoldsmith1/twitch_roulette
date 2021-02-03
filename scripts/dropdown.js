$('.ui.dropdown').dropdown({
  clearable: true,
  keys: {
      enter: ''
  },
  forceSelection: false,
  fullTextSearch: true
});

$('#history-button').click(function(){
  $('.ui.modal').modal('show');
})