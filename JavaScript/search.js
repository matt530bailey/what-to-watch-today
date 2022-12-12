const redirectHomepage = "./index.html"
const searchString = localStorage.getItem("localSearchFilter");
const searchFilter = JSON.parse(searchString)
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

$('.reset-btn').click(function () {
    document.location.replace(redirectHomepage);
    localStorage.clear()
})

// Randomly select 4 items from search result to save in and delete them from the movie Pool
function getRandomFour(dataResult) {
    if(generatedMovies){generatedMovies = []}
    for (let i = 0; i < 4; i++) {
        var randomIndex = Math.floor(Math.random() * dataResult.length);
        generatedMovies.push(dataResult[randomIndex])
        dataResult.splice(randomIndex, 1)
        console.log(dataResult)
        console.log(generatedMovies)
    }
    saveMoviePool(moviePool)
    saveGeneratedMovies(generatedMovies)
    getMovieId(generatedMovies)
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
                    getRandomFour(moviePool)
                    console.log(moviePool);
                    
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log('something is wrong');
        });
};
// A function to get movie id and use it in other functions
function getMovieId(movieData) {
    for (let i = 0; i < movieData.length; i++) {
        var movieID = movieData[i].id
        console.log(movieID);
        createCardComponents(movieData[i])
        addButtons($("#" + movieID));
    }
}
// Save the generated movies in local storage
function saveGeneratedMovies(Data) {
    localStorage.setItem('generated-movies', JSON.stringify(Data));
}
// Save the movie pool in local storage
function saveMoviePool(Data) {
    localStorage.setItem('movie-pool', JSON.stringify(Data));
}
// Load the generated movies from local storage
function loadGeneratedMovies() {
    generatedMovies = JSON.parse(localStorage.getItem('generated-movies'))
}
// Load the movie pool from local storage
function loadMoviePool() {
    moviePool = JSON.parse(localStorage.getItem('movie-pool'))
}
// This function will load data from local storage and render the page when refreshed
function generateFromStorage() {
    let localMoviePool = localStorage.getItem('movie-pool')
    let localGeneratedMovies = localStorage.getItem('generated-movies')
    // only generate from local storage when both local storage keys are not empty
    if (localMoviePool && localGeneratedMovies) {
        console.log('generated from local storage')
        loadMoviePool()
        loadGeneratedMovies()
        getMovieId(generatedMovies)
    } else {getTMDBApi(searchFilter.isAdult, searchFilter.yearsToNow, searchFilter.movieLength, searchFilter.genres)}
}

// This function to create a template to add card elements in html file
function createCardComponents(movieInfo) {
    $(".cardContainer").append(`
        <div class="col s12 m6 l3">
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
function addButtons(returnValue) {
    // generate buttons for the card
    var showTrailerBtnEl = $('<button>')
    showTrailerBtnEl.addClass('waves-effect waves-light btn-small trailer-btn modal-trigger')
    showTrailerBtnEl.attr('href', '#modal1')
    showTrailerBtnEl.text('Watch trailer')
    var iconEl = $('<i>')
    iconEl.addClass('material-icons left')
    iconEl.text('ondemand_video')
    showTrailerBtnEl.append(iconEl)
    // append buttons to cards and add click event
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
    var selectTitle = $(targetBtn).parent().siblings(0).children(1)[1].textContent //select the title of the movie
    console.log(selectTitle)
    getYoutubeApi(selectTitle) //get search results by searching with title
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
                    getTrailerUrl(data) //get the trailer using the video ID fetched from API
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
    addTrailerUrl(trailerUrl) // Add the url to iframe video player
}
// Set the position of the close button of the player
function adjustCloseBtn() {
    var closeBtnEl = $('#closebutton')
    closeBtnEl.css({ 'position': 'absolute', 'top': '-30px', 'right': '-30px' })
}

// Show the next 4 different movies
function showNext4() {
    console.log(moviePool)
    var cardContainerEl = $('#search-results')
    if (moviePool.length === 0 || !localStorage.getItem('movie-pool')) {
        console.log('movie pool empty')
        $('#modal2').modal('open') // The modal that says there is no more results
        return
    } else {
        // Clear the card container before generate new cards
        if(cardContainerEl) {cardContainerEl.empty()}
        if(generatedMovies) {generatedMovies = []}
        console.log(generatedMovies)
        getRandomFour(moviePool)
    }
}
// -------------------------------------------------------------------------------------
// excute functions
adjustCloseBtn()
$('#showmore').click(showNext4)
generateFromStorage()