
const searchFilter = {
    movieLength: "",
    yearsToNow: "",
    genres: [],
    isAdult: false,
}
const searchResultsPage = "./searchResults.html"
const currentYear = dayjs().format('YYYY');
var generatedMovies = []
var moviePool = []
var trailerUrl = "";

$(document).ready(function () {
    $('.sidenav').sidenav();
});

// Save the search filter to local storage
function saveSearchFilter(searchFilter) {
    var searchFilterString = JSON.stringify(searchFilter);
    localStorage.setItem("localSearchFilter", searchFilterString);
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
        saveSearchFilter(searchFilter)
        allDone();
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
    document.location.replace(searchResultsPage);

}



// $('#show5more').click(showNext5)

$(resetBtn).click(function () {
    location.reload();
})

// console.log(ansArray)

// excute functions
// adjustCloseBtn()
// creatCardsFromStorage()
