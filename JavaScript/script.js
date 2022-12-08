var bodyEl = document.querySelector('body');
const genreCodeList = {
    Action: 28,
    Animation: 16,
    Comedy: 35,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    Horror: 27,
    Mystery: 9648,
    Romance: 10749,
    Thriller: 53,
    Western: 37,
}

var searchFilter = {
    movieLength: "",
    yearsToNow: "",
    genres: [],
    isAdult: false,
}

var testingSearchFilter = {
    movieLength: "200",
    yearsToNow: "15",
    genres: [genreCodeList.Action, genreCodeList.Western],
    isAdult: false,
}
console.log(testingSearchFilter.genres)
var currentYear = dayjs().format('YYYY');
var yearBefore = currentYear - testingSearchFilter.yearsToNow;
var releaseDateBefore = yearBefore + '-12-31';
var localMovieData = [];
var youtubeVideoUrl = "";
// var movieInfo = {
//     index: 0,
//     title: '',
//     overview: '',
//     releaseDate: '',
//     rating: '',
//     posterPath: '',
//     movieID: '',
// };

$(document).ready(function () {
    $('.modal').modal({
        dismissible: false,
        opacity: 0.6,
        onCloseStart: stopVideo,
    },
  );
  })

$(document).ready(function () {
    $('.sidenav').sidenav();
});

// get rough data from TMDB API
var getTMDBApi = function (searchResults) {
    var testingUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=337b93ffd45a2b68e431aed64d687099&language=en-US&sort_by=popularity.desc&include_adult=' + searchResults.isAdult + '&release_date.lte=' + releaseDateBefore + '&with_runtime.lte=' + searchResults.movieLength + '&with_genres=' + searchResults.genres.toString()

    console.log(testingUrl)
    fetch(testingUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    data.results.splice(4, 15)
                    console.log(data);
                    getTMDBDetail(data)
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log('something is wrong');
        });
};

// A function to get more detailed data from TMDB API (the length of the movie)
function getTMDBDetail(movieData) {
    for (let i = 0; i < movieData.results.length; i++) {
        var movieResult = movieData.results[i]
                        console.log(movieResult);
                        console.log(localMovieData.length)
                        // call the function to write info in an object
                        // generateInfo(movieResult);
                        createCardComponents(movieResult)
                        addButtonsPlusClickEvents($("#" + localMovieData.length));
                        localMovieData.push(movieResult);
                        console.log(localMovieData);
                        storeMovieData(localMovieData)
                        // console.log(movieInfo.index)
                        // console.log(movieInfo)
    }
    // return
}
// push objects to an array to save in local storage
function storeMovieData (localMovieData) {
    var movieInfoString = JSON.stringify(localMovieData);
    localStorage.setItem("storedMovieData", movieInfoString);
}

// function generateInfo(movieData) {
//     // getting movie info from TMDB API and save in an object
//     movieInfo.title = movieData.title
//     movieInfo.overview = movieData.overview
//     movieInfo.releaseDate = movieData.release_date
//     movieInfo.rating = movieData.vote_average
//     movieInfo.posterPath = 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/' + movieData.poster_path
//     movieInfo.movieID = movieData.id
//     return movieInfo
//     // console.log(movieInfo)
// }

// This function to create a template to add card elements in html file
function createCardComponents(movieInfo) {
    $(".cardContainer").append(`
        <div class="col s12 m6 l4">
            <div class="card large card-panel grey lighten-5">
                <div class="card-image">
                    <img src='https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieInfo.poster_path}'>
                        <span class="card-title" style='background-color: rgba(0,0,0,0.6)'>${movieInfo.title}</span>
                </div>
                <div class="card-content" style="overflow:scroll">
                    <p>${movieInfo.overview}</p>
                </div>
                <div class="card-action" id="${localMovieData.length}">
                </div>
            </div>
        </div>
    `);
}

// Added a clickevent to all trailer buttons
function addButtonsPlusClickEvents(returnValue) {
    var trailerBtnEl = $('<button>')
    trailerBtnEl.addClass('waves-effect waves-light btn-small trailer-btn modal-trigger')
    trailerBtnEl.attr('href', '#modal1')
    trailerBtnEl.text('Watch trailer')
    var iconEl = $('<i>')
    iconEl.addClass('material-icons left')
    iconEl.text('ondemand_video')
    trailerBtnEl.append(iconEl)
    returnValue.append(trailerBtnEl)
    returnValue.click(showYouTubeTrailer)
    // movieInfo.index += 1
}

function stopVideo() {
    console.log($('iframe'))
    $('#video-player').removeAttr('src')
}

function addVideoPlayer(youtubeVideoUrl) {
    $("#video-player").attr('src', youtubeVideoUrl)
}

// Creat a function that will locate the movie title and pass it to a search in youtube API
function showYouTubeTrailer(event) {
    var targetBtn = event.target;
    if (!$(targetBtn).is('.trailer-btn')) {
        return;
    }
    console.log("Button is clicked")
    var selectTitle = $(targetBtn).parent().siblings(0).children(1)[1].textContent
    console.log(selectTitle)
    getYoutubeApi(selectTitle)
}

// Added a function to get movie data from youtube API
function getYoutubeApi(movieTitle) {
    var requestUrl = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyD1uynd7oG6CN6SYji9ikR02DcBQbDPy8w&order=relevance&q=' + movieTitle + ' trailer&type=video&videoDefinition=high&maxResults=1'
    console.log(requestUrl)
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);
                    generateYoutubeVideoUrl(data)
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log('something is wrong');
        });
}
function generateYoutubeVideoUrl(youtubeApi) {
    var getYoutubeVideoID = youtubeApi.items[0].id.videoId;
    youtubeVideoUrl = "https://www.youtube.com/embed/" + getYoutubeVideoID
    console.log(youtubeVideoUrl)
    addVideoPlayer(youtubeVideoUrl)
}
function adjustCloseBtn (){
    var closeBtnEl = $('#closebutton')
    closeBtnEl.css({'position':'absolute', 'top':'-30px', 'right':'-30px'})
}

// -------------------------------------------------------------------------------------


// adding questions
var questions = {
    questionsArray: [
        {
            q: 'How are you feeling today?',
            a: [
                { text: 'Happy 😃' },
                { text: 'Neutral😑' },
                { text: 'Sad 😟' }

            ]
        },
        {

            q: 'What is the occation?',
            a: [
                { text: 'Alone time' },
                { text: 'On a date' },
                { text: 'With friends' },
                { text: 'With family' }
            ]
        },
        {
            q: 'What genre would you like?',
            a: [

                { text: 'Action' },
                { text: 'Comedy' },
                { text: 'Drama' },
                { text: 'Fantasy' },
                { text: 'Horror' },
                { text: 'Mystery' },
                { text: 'Romance' },
                { text: 'Thriller' },
                { text: 'Western' }

            ]
        },
        {
            q: 'How old would you like the movie to be?',
            a: [
                { text: 'One year or less' },
                { text: 'Five years or less' },
                { text: 'Ten years or less' },
                { text: 'Twenty years or less' }
            ]
        },
        {
            q: 'How long would would you like the movie to be?',
            a: [
                { text: 'Up to 2 hours' },
                { text: 'Up to 3 hours' },
                { text: 'Up to 4 hours' }
            ]
        }
    ]
}

var welcomeEl = $('#container')
var questionBox = $('#questionsContainer')
var startButton = $('#startBtn')
var questionEl = $('#question')
var answerBtn = $('#answer-buttons')
var answerEl = []
var resultsEl = $("#results")
var questionIndex = 0
var startGame = function () {
    //add classes to show/hide start and quiz screen
    welcomeEl.addClass('hide');
    welcomeEl.removeClass('show');
    questionBox.removeClass('hide');
    questionBox.addClass('show');
    displayQuestion()
}
$(startButton).on('click', startGame)



//Display Question with answer buttons
function displayQuestion() {

    questionEl.text(questions.questionsArray[questionIndex].q)

    answerBtn.html("")
    for (var i = 0; i < questions.questionsArray[questionIndex].a.length; i++) {
        var btn = $("<button>")
        btn.text(questions.questionsArray[questionIndex].a[i].text);
        btn.addClass('"waves-effect waves-teal btn-flat"')
        btn.on("click", selectAnswer)
        answerBtn.append(btn)
    }
}

function selectAnswer(event) {
    event.preventDefault();
    console.log(event.target)

    questionIndex++

    if (questionIndex >= questions.questionsArray[questionIndex].a.length) {
        allDone();

    } else {
        displayQuestion()
    }


}

function allDone() {
    questionBox.removeClass('show');
    questionBox.addClass('hide');
    resultsEl.removeClass('hide');
    resultsEl.addClass('show')
}

// set next question

// excute functions
adjustCloseBtn()
getTMDBApi(testingSearchFilter)

// creatCardsFromStorage()
// testingTMDBApi(testingSearchFilter)