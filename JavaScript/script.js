var bodyEl = document.querySelector('body');

var searchFilter = {
    movieLength: "",
    yearsToNow: "",
    genre: "",
    isAdult: false,
}

var localMovieData = [];
var youtubeVideoUrl = "";
var movieInfo = {
    index: 0,
    title: '',
    overview: '',
    releaseDate: '',
    runtimeHour: '',
    runtimeMinute: '',
    rating: '',
    posterPath: '',
    movieID: '',
};
// var movieInfoJSON = JSON.parse(localStorage.getItem("storedMovieData"));


// get rough data from TMDB API
var getTMDBApi = function (searchResults) {
    var testing = 'trending/movie/week'
    var getTMDBUrl ='https://api.themoviedb.org/3/' + testing + '?api_key=337b93ffd45a2b68e431aed64d687099&append_to_response=videos,images'
    fetch(getTMDBUrl)
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
function getTMDBDetail(movieData, passData) {
    for (let i = 0; i < movieData.results.length; i++) {
        var movieID = movieData.results[i].id
        var getRuntimeById = 'https://api.themoviedb.org/3/movie/' + movieID + '?api_key=337b93ffd45a2b68e431aed64d687099&append_to_response=videos,images'
        fetch(getRuntimeById)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (detailedData) {
                        console.log(detailedData);
                        // call the function to write info in an object
                        generateInfo(detailedData);
                        // push objects to an array to save in local storage
                        // localMovieData.push(movieInfo);
                        // console.log(localMovieData);
                        // var movieInfoString = JSON.stringify(localMovieData);
                        // localStorage.setItem("storedMovieData", movieInfoString);
                        console.log(movieInfo.index)
                        createCardComponents(movieInfo)
                        addClickEvent($("#" + movieInfo.index));
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
 

}

function generateInfo(movieData) {
    // getting movie info from TMDB API and save in an object and local storage
        movieInfo.title= movieData.title,
        movieInfo.overview= movieData.overview,
        movieInfo.releaseDate= movieData.release_date,
        movieInfo.runtimeHour= Math.floor((movieData.runtime) / 60),
        movieInfo.runtimeMinute= (movieData.runtime) % 60,
        movieInfo.rating= movieData.vote_average,
        movieInfo.posterPath= 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/' + movieData.poster_path,
        movieInfo.movieID= movieData.id,

   
    console.log(movieInfo)
}

// This function to create a template to add card elements in html file
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
                <div class="card-action" id="${movieInfo.index}">
                </div>
            </div>
        </div>
    `);
}

// Creat cards from local storage instead of directly from the parent function
// function creatCardsFromStorage() {
//     // var movieInfoJSON = JSON.parse(localStorage.getItem("storedMovieData"));
   
//     for (let i = 0; i < movieInfoJSON.length; i++) {
//         console.log(movieInfoJSON[i]);
//         createCardComponents(movieInfoJSON[i]);
//     }

// }

// Added a clickevent to all trailer buttons
function addClickEvent(returnValue) {
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
    movieInfo.index += 1
}

function stopVideo(){
    console.log($('#video-player'))
    $('#video-player')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
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

// class DynamicElement {
//     constructor(elType, elContent, elClass, elId, elstyle, elSrc, elHref) {
//         this.el = document.createElement(elType)
//         if(elContent){this.el.innerText = elContent}
//         if(elClass){this.el.setAttribute('class', elClass)}
//         if(elId){this.el.setAttribute('id', elId)}
//         if(elstyle){this.el.setAttribute('style', elstyle)}
//         if(elSrc){this.el.setAttribute('src', elSrc)}
//         if(elHref){this.el.setAttribute('href', elHref)} 
//         console.log(this.el)
//         return this.el
//     }
// }

// var cardHolderEl = new DynamicElement('div',"", 'col s12 m6 l4')
// var cardEl = new DynamicElement('div', '', 'card large card-panel grey lighten-5')
// var imgHolderEl = new DynamicElement('div', '', 'card-image')
// var imgEl = new DynamicElement('img', '', '', '', '', './images/movie1.jpg')
// var cardContainerEl = $('.cardContainer')

// cardContainerEl.append(cardHolderEl)
// cardHolderEl.append(cardEl)
// cardEl.append(imgHolderEl)
// imgHolderEl.append(imgEl)

// -------------------------------------------------------------------------------------


// adding questions
