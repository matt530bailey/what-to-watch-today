var bodyEl = document.querySelector('body');

var searchFilter = ""
var localMovieData = [];
var movieInfo = {
    title: '',
    overview: '',
    releaseDate: '',
    runtimeHour: '',
    runtimeMinute: '',
    rating: '',
    posterPath: '',
    movieID: '',
};

// get rough data from TMDB API
var getMovieData = function (searchResults) {
    searchFilter = 'trending/movie/week'
    var requestUrl = 'https://api.themoviedb.org/3/' + searchFilter + '?api_key=337b93ffd45a2b68e431aed64d687099&append_to_response=videos,images'
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    data.results.splice(4, 15)
                    // console.log(data);
                    getDetailedData(data)
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
function getDetailedData(movieData, passData) {
    for (let i = 0; i < movieData.results.length; i++) {
        var movieID = movieData.results[i].id
        var getRuntimeById = 'https://api.themoviedb.org/3/movie/' + movieID + '?api_key=337b93ffd45a2b68e431aed64d687099&append_to_response=videos,images'
        fetch(getRuntimeById)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (detailedData) {
                        // console.log(detailedData);
                        // call the function to write info in an object
                        generateInfo(detailedData);
                        // push objects to an array to save in local storage
                        localMovieData.push(movieInfo);
                        console.log(localMovieData);
                        var movieInfoString = JSON.stringify(localMovieData);
                        localStorage.setItem("storedMovieData", movieInfoString);
                    })
                } else {
                    alert('Error: ' + response.statusText);
                }
            })
            .catch(function (error) {
                console.log('something is wrong');
            });
    }
    // IDK why $(".trailer-btn") selector won't work outside of this function
    passData = $(".trailer-btn");
    addClickEvent(passData);
}

function generateInfo(movieData) {
    // getting movie info from TMDB API and save in an object and local storage
    movieInfo = {
        title: movieData.title,
        overview: movieData.overview,
        releaseDate: movieData.release_date,
        runtimeHour: Math.floor((movieData.runtime) / 60),
        runtimeMinute: (movieData.runtime) % 60,
        rating: movieData.vote_average,
        posterPath: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/' + movieData.poster_path,
        movieID: movieData.id,
    };
    // console.log(movieInfo)
}

// This function to create card elements in html file
function createCardComponents(movieInfo) {
    $(".cardContainer").append(`
        <div class="col s12 m6 l4">
            <div class="card large card-panel grey lighten-5">
                <div class="card-image">
                    <img src="${movieInfo.posterPath}">
                        <span class="card-title" style='background-color: rgba(0,0,0,0.6)'>${movieInfo.title}</span>
                </div>
                <div class="card-content" style="overflow:scroll">
                    <p>${movieInfo.overview}</p>
                </div>
                <div class="card-action">
                <button class="waves-effect waves-light btn-small trailer-btn"><i class="material-icons left">ondemand_video</i>Watch trailers</button>
                </div>
            </div>
        </div>
    `);
}


// Added a function to get movie data from youtube API
function getYoutubeApi(movieTitle) {
    var requestUrl = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyDiQY5fOJM3wOKvBOcdVkr5s8Vi6m2xF08&order=relevance&q=' + movieTitle + ' trailer&type=video&videoDefinition=high&maxResults=3'
    console.log(requestUrl)
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log('something is wrong');
        });
}

// Added a clickevent to all trailer buttons
function addClickEvent(returnValue) {
    returnValue.click(showYouTubeTrailer)
}

// Creat a function that will locate the movie title and pass it to a search in youtube API
function showYouTubeTrailer(event) {
    console.log("I'm clicked")
    var targetBtn = event.currentTarget;
    if (!$(targetBtn).is('.trailer-btn')) {
        return;
    }
    var selectTitle = $(targetBtn).parent().siblings(0).children(1)[1].textContent
    console.log(selectTitle)
    getYoutubeApi(selectTitle)

}

// Creat cards from local storage instead of directly from the parent function
function creatCardsFromStorage() {
    var movieInfoJSON = JSON.parse(localStorage.getItem("storedMovieData"));
    for (let i = 0; i < movieInfoJSON.length; i++) {
        console.log(movieInfoJSON[i]);
        createCardComponents(movieInfoJSON[i]);
    }
}

// -------------------------------------------------------------------------------------


// adding questions
var questions = {
        questionsArray:[
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
]}

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
    
    if (questionIndex >= questions.questionsArray[questionIndex].a.length){
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
getMovieData()
creatCardsFromStorage()
