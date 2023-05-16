var options = ['Select your mood', 'Romantic', 'Anger', 'Fear', 'Gloomy', 'Calm', 'Playful', 'Surprise', 'Rock', 'Pop', 'Jazz', 'Country', 'Classical', 'Dance', 'Alternative', 'Latin', 'Suprise-me'];


document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, options);
});
// added below code so everything on the page loads before the search tries being preformed
document.addEventListener('DOMContentLoaded', function() {
  // targets the drop-down ID
var select = document.querySelector('#drop-down');

// listening for 
select.addEventListener('change', function () {

  var selectedValue = select.value;
  console.log(selectedValue);

  var searchQuery = '';
  switch (selectedValue) {
    case 'Rock':
      searchQuery = 'Rock songs';
      break;
    case 'Pop':
      searchQuery = 'songs about pop';
      break;
    case 'Jazz':
      searchQuery = 'songs about jazz';
      break;
    case 'Country':
      searchQuery = ' country songs';
      break;
    case 'Classical':
      searchQuery = 'classical songs';
      break;
    case 'Dance':
      searchQuery = ' dance songs';
      break;
    case 'Alternative':
      searchQuery = 'Alternative songs';
      break;
    case 'Latin':
      searchQuery = 'Latin songs';
      break;
    case 'Suprise-me':
      searchQuery = 'Random song genre';
      break;

  }
  console.log(searchQuery);

  if (searchQuery !== '') {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(searchQuery));
  }
});

var mood = document.querySelector('#drop-down2');


mood.addEventListener('change', function () {

  var moodValue = mood.value;
  console.log(moodValue);

  var moodQuery = '';
  switch (moodValue) {

case 'Romantic':
  moodQuery = 'Romantic songs';
  break;
case 'Anger':
  moodQuery = 'Angry songs';
  break;
case 'Fear':
  moodQuery = 'Scary songs';
  break;
case 'Gloomy':
  moodQuery = 'Gloomy songs';
  break;
case 'Calm':
  moodQuery = 'Calm songs';
  break;
case 'Playful':
  moodQuery = 'Playful songs';
  break;
case 'Suprise':
  moodQuery = 'Random songs';
  break;

}
console.log(moodQuery);

if (moodQuery !== '') {
window.open('https://www.google.com/search?q=' + encodeURIComponent(moodQuery));
}
});
});