
const searchFilter = {
    movieLength: "",
    yearsToNow: "",
    genres: [],
    isAdult: false,
}

const currentYear = dayjs().format('YYYY');
var generatedMovies = []
var moviePool = []
var trailerUrl = "";

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

function getRandomFive(dataResult) {
    var randomIndex = Math.floor(Math.random() * dataResult.length);
    generatedMovies.push(dataResult[randomIndex])
    dataResult.splice(randomIndex, 1)
    console.log(randomIndex)
    console.log(dataResult)
    console.log(generatedMovies)
    return generatedMovies
}


// get rough data from TMDB API
var getTMDBApi = function (isAdult, yearsToNow, runTimeMinutes, genres) {
    var testingUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=337b93ffd45a2b68e431aed64d687099&language=en-US&sort_by=popularity.desc&include_adult=' + isAdult + '&release_date.gte=' + yearsToNow + '-01-01&with_runtime.lte=' + runTimeMinutes + '&with_genres=' + genres.toString()
    console.log(testingUrl)
    fetch(testingUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    moviePool = data.results
                    console.log(moviePool);
                    for (let i = 0; i < 5; i++) {
                        getRandomFive(moviePool)
                    }
                    getTMDBDetail(generatedMovies)
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
    for (let i = 0; i < movieData.length; i++) {
        var movieID = movieData[i].id
        console.log(movieID);
        createCardComponents(movieData[i])
        addButtonsPlusClickEvents($("#" + movieID));
        saveFullData(generatedMovies)
    }
}
// Save the movie infos in local storage
function saveFullData(localMovieData) {
    var movieInfoString = JSON.stringify(localMovieData);
    localStorage.setItem("localMovieData", movieInfoString);
}
// Save the search filter to local storage
function saveSearchFilter(searchFilter) {
    var searchFilterString = JSON.stringify(searchFilter);
    localStorage.setItem("localSearchFilter", searchFilterString);
}

// This function to create a template to add card elements in html file
function createCardComponents(movieInfo) {
    $(".cardContainer").append(`
        <div class="col s12 m6 l2">
            <div class="card large card-panel grey lighten-5">
                <div class="card-image">
                    <img src='https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${movieInfo.poster_path}'>
                        <span class="card-title" style='background-color: rgba(0,0,0,0.6); font-weight: bold'>${movieInfo.title}</span>
                </div>
                <div class="card-content" style="overflow:scroll; line-height:1.5">
                    <p>${movieInfo.overview}</p>
                </div>
                <div class="card-action" id="${movieInfo.id}">
                </div>
            </div>
        </div>
    `);
}

// Generate show trailer buttons and add clickevent to them
function addButtonsPlusClickEvents(returnValue) {
    var showTrailerBtnEl = $('<button>')
    showTrailerBtnEl.addClass('waves-effect waves-light btn-small trailer-btn modal-trigger')
    showTrailerBtnEl.attr('href', '#modal1')
    showTrailerBtnEl.text('Watch trailer')
    var iconEl = $('<i>')
    iconEl.addClass('material-icons left')
    iconEl.text('ondemand_video')
    showTrailerBtnEl.append(iconEl)
    returnValue.append(showTrailerBtnEl)
    returnValue.click(showTrailer)
}
// To stop the trialer from playing
function stopVideo() {
    console.log($('iframe'))
    $('#video-player').removeAttr('src')
}
// Add trailer Url to iframe so that it will show trailer
function addTrailerUrl(trailerUrl) {
    $("#video-player").attr('src', trailerUrl)
}

// Creat a function that will locate the movie title and pass it to a search in youtube API
function showTrailer(event) {
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
    var requestUrl = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyD1uynd7oG6CN6SYji9ikR02DcBQbDPy8w&order=relevance&q=' + movieTitle + ' movietrailer&type=video&videoDefinition=high&maxResults=1'
    console.log(requestUrl)
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);
                    getTrailerUrl(data)
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log('something is wrong');
        });
}
// Use the data from youtube API to generate the viedo ID and url
function getTrailerUrl(youtubeApi) {
    var trailerID = youtubeApi.items[0].id.videoId;
    trailerUrl = "https://www.youtube.com/embed/" + trailerID
    console.log(trailerUrl)
    addTrailerUrl(trailerUrl)
}
// Set the position of the close button of the player
function adjustCloseBtn() {
    var closeBtnEl = $('#closebutton')
    closeBtnEl.css({ 'position': 'absolute', 'top': '-30px', 'right': '-30px' })
}

// Show the next 5 different movies
function showNext5() {
    console.log(moviePool)
    var cardContainerEl = $('#search-results')
    if (moviePool.length === 0) {
        $('#modal2').modal('open')
        return
    } else {
        if (cardContainerEl) { cardContainerEl.empty() }
        if (generatedMovies) { generatedMovies = [] }
        for (let i = 0; i < 5; i++) {
            getRandomFive(moviePool)
        }
        getTMDBDetail(generatedMovies)
    }
}

// -------------------------------------------------------------------------------------


// adding questions with values
var questionsArray = [
    {
        q: 'How are you feeling today?',
        a: [
            { text: 'Happy 😃', value: 2 },//2
            { text: 'Neutral😑', value: 1 }, //1
            { text: 'Sad 😟', value: 0 }//0

        ]
    },
    {

        q: 'What is the occasion?',
        a: [
            { text: 'On a date', value: 3 },//3
            { text: 'With friends', value: 2 },//2
            { text: 'With family', value: 1 }, //1
            { text: 'Alone time', value: 0 },//0
        ]
    },
    {
        q: 'What genre would you like?',
        a: [

            { text: 'Action', value: 28 },
            { text: 'Comedy', value: 35 },
            { text: 'Fantasy', value: 14 },
            { text: 'Horror', value: 27 },
            { text: 'Mystery', value: 9648 },
            { text: 'Thriller', value: 53 },
            { text: 'Western', value: 37 },
            { text: 'Drama', value: 18 },
            { text: 'Romance', value: 10749 },
            { text: 'Any 🤷‍♂️', value: 0 },

        ]
    },
    {
        q: 'How old would you like the movie to be?',
        a: [
            { text: 'One year or less', years: 1 },
            { text: 'Five years or less', years: 5 },
            { text: 'Ten years or less', years: 10 },
            { text: 'Twenty years or less', years: 20 }
        ]
    },
    {
        q: 'How long would would you like the movie to be?',
        a: [
            { text: 'Up to 2 hours', min: 120 },
            { text: 'Up to 3 hours', min: 180 },
            { text: 'Up to 4 hours', min: 240 }
        ]
    }
]

//variables
var welcomeEl = $('#container')
var questionBox = $('#questionsContainer')
var startButton = $('#startBtn')
var questionEl = $('#question')
var answerBtn = $('#answer-buttons')
var resetBtn = $('.reset-btn')
var answerEl = []
var resultsEl = $("#results")
var questionIndex = 0
var ansArray = [];
var ansScore = [];

// after start button is pressed
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


    questionEl.text(questionsArray[questionIndex].q)

    answerBtn.html("")
    for (var i = 0; i < questionsArray[questionIndex].a.length; i++) {
        var btn = $("<button>")
        var br = $("<br>")
        btn.text(questionsArray[questionIndex].a[i].text);
        btn.val(questionsArray[questionIndex].a[i].value);
        btn.attr("data-years", questionsArray[questionIndex].a[i].years)
        btn.attr("data-min", questionsArray[questionIndex].a[i].min)
        btn.addClass("waves-effect waves-light ansbtn effect")
        btn.on("click", selectAnswer)

        answerBtn.append(btn, br)
    }
}

//what happens when answer is chosen
function selectAnswer(event) {
    event.preventDefault();
    console.log(event.target.innerText)
    console.log(event.target.value)

    questionIndex++
    if (event.target.getAttribute('data-years')) {
        searchFilter.yearsToNow = currentYear - event.target.getAttribute('data-years')
        console.log(event.target.getAttribute('data-years'))
    }

    if (event.target.getAttribute('data-min')) {
        searchFilter.movieLength = event.target.getAttribute('data-min')
    }


    ansArray.push(event.target.innerText)
    ansScore.push(parseInt(event.target.value))

    console.log(ansScore)

    // end cycle of questions
    if (questionsArray.length < (questionIndex + 1)) {
        allDone();
        saveSearchFilter(searchFilter)
        getTMDBApi(searchFilter.isAdult, searchFilter.yearsToNow, searchFilter.movieLength, searchFilter.genres)
    } else {
        displayQuestion()
    }

    var totalScore = ansScore[0] + ansScore[1] + ansScore[2]
    console.log("totalScore = " + totalScore)


    // If statement to get genres.  If user chooses a genre on question 3, it overwrites the chosen genre based on the first two questions.
    if (totalScore > 5) {
        searchFilter.genres = ansScore[2]
        console.log(ansScore[2])
    } else if (totalScore > 4) {

        searchFilter.genres = genreCodeList.ROMANCE
    } else if (totalScore > 3) {

        searchFilter.genres = genreCodeList.ACTION
    } else if (totalScore >= 2) {

        searchFilter.genres = genreCodeList.ANIMATION
        console.log(genreCodeList.ANIMATION)
    } else if (totalScore < 2) {

        searchFilter.genres = genreCodeList.COMEDY
    }


}

// once the questions are answered
function allDone() {
    var redirectUrl = './searchResults.html';

    questionBox.removeClass('show');
    questionBox.addClass('hide');
    resultsEl.removeClass('hide');
    resultsEl.addClass('show')
    // document.location.replace(redirectUrl);

}



$('#show5more').click(showNext5)

$(resetBtn).click(function () {
    location.reload();
})

console.log(ansArray)

// excute functions
adjustCloseBtn()
// creatCardsFromStorage()
