$('.ui.dropdown').dropdown({
  clearable: true,
  keys: { 
    enter: '' 
  },
  forceSelection: false,
  fullTextSearch: true, 
  selected: false
});

$('#history-button').click(function(){
  $('.ui.modal').modal('show');
})