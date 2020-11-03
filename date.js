exports.getDate = function(){
  let today = new Date();

  let options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}


exports.getDay = function() {
  let today = new Date();

  let options = {
    weekday: 'long',
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}
