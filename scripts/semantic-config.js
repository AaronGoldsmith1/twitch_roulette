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