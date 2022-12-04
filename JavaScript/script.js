var bodyEl = document.querySelector('body');


var searchFilter = ""
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


var getMovieData = function (searchResults) {
    searchFilter = 'trending/movie/week'
    var requestUrl = 'https://api.themoviedb.org/3/' + searchFilter + '?api_key=337b93ffd45a2b68e431aed64d687099&append_to_response=videos,images'

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    data.results.splice(4, 15)
                    console.log(data);
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


function getDetailedData(movieData) {
    for (let i = 0; i < movieData.results.length; i++) {
        var movieID = movieData.results[i].id
        var getRuntimeById = 'https://api.themoviedb.org/3/movie/' + movieID + '?api_key=337b93ffd45a2b68e431aed64d687099&append_to_response=videos,images'
        fetch(getRuntimeById)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (detailedData) {

                        console.log(detailedData);
                        generateInfo(detailedData)
                        var movieInfoString = JSON.stringify(movieInfo);
                        localStorage.setItem('movie_' + [i], movieInfoString);
                        var movieInfoJSON = JSON.parse(localStorage.getItem('movie_' + [i]))
                        console.log(movieInfoJSON)
                        createCardComponents(movieInfoJSON)

                    })
                } else {
                    alert('Error: ' + response.statusText);
                }
            })
            .catch(function (error) {
                console.log('something is wrong');
            });
    }

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
    console.log(movieInfo)


}

function createCardComponents(movieData) {
    $(".cardContainer").append(`
        <div class="col s12 m6 l4">
            <div class="card large card-panel grey lighten-5">
                <div class="card-image">
                    <img src="${movieData.posterPath}">
                        <span class="card-title">${movieData.title}</span>
                </div>
                <div class="card-content" style="overflow:scroll">
                    <p>${movieData.overview}</p>
                </div>
                <div class="card-action">
                    <a href="#">This is a link</a>
                </div>
            </div>
        </div>

    `);

}
// adding questions
var questions = [
    {
        q: 'How are you feeling today?',
        a: [
            { text: 'Happy' },
            { text: 'Neutral' },
            { text: 'Sad' }

        ]
    },
    {
        q: 'What is the occation?',
        a: [
            { text: 'Alone time' },
            { text: 'On a date' },
            { text: 'With friends' },
            {text: 'With family'}
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

var welcomeEl = $('#container')
var questionBox = $('#questionsContainer')
var startButton = $('#startBtn')
var questionEl = $('#question')

var answerEl = []

var questionIndex = 0
var startGame = function() {
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
    questionEl.text(questions[questionIndex].q)
    
    for (var i = 0; i < questions[questionIndex].a.length; i++) {
        var answerButton = $("<button>")
        answerButton.text(questions[questionIndex].a[i].text);
        // answerbutton.addClass('btn')
        // answerbutton.addClass('answerbtn')
        answerButton.on("click", saveToLocal)
        answerButton.append(answerButton)
        }
    }

    function saveToLocal(){
        this.text(questions[index].a);
        const json0 = JSON.stringify(this);

    }

function nextQuestions(){
    questionIndex++;
    displayQuestion();
}
// set next question


getMovieData()