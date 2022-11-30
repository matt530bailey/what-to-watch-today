var bodyEl = document.querySelector('body');


var searchFilter = ""

var getMovieData = function (movieTitle) {
    searchFilter = 'trending/movie/week'
    var requestUrl = 'https://api.themoviedb.org/3/' + searchFilter + '?api_key=337b93ffd45a2b68e431aed64d687099&append_to_response=videos,images&on_page=5'

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    data.results.splice(4, 15)
                    console.log(data);
                    generatePoster(data);
                    // generateInfo(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log('something is wrong');
        });
};

function generatePoster(movieData) {
    for (let i = 0; i < movieData.results.length; i++) {
        var posterUrl = movieData.results[i].poster_path;
        var movieCardEl = document.createElement('div');
        movieCardEl.setAttribute('class', 'movie-card');
        bodyEl.appendChild(movieCardEl);
        if (!posterUrl) {
            console.log('No poster found');
            return;
        } else {
            var posterEl = document.createElement('img');
            posterEl.setAttribute('class', 'movie-poster')
            posterEl.setAttribute('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/' + posterUrl);
            movieCardEl.appendChild(posterEl);
        };
        console.log(posterUrl)
        console.log(posterEl)
        console.log(movieCardEl)
    }
};

// function generateInfo (movieData) {
//     // getting movie info from TMDB API and save in an object and local storage
//     var movieInfo = {
//         title: movieData.original_title,
//         overview: movieData.overview,
//         releaseDate: movieData.release_date,
//         runtimeHour: Math.floor((movieData.runtime) / 60),
//         runtimeMinute: (movieData.runtime) % 60,
//     }
//     console.log(movieInfo)
//     // generate 
//     var movieInfoEl = document.createElement('div');
//     movieInfoEl.setAttribute('class', 'movie-info');
//     var movieTitleEl = document.createElement('h2');
//     movieTitleEl.setAttribute('class', 'movie-title');
//     movieTitleEl.innerHTML = movieInfo.title;
//     var movieOverviewEl = document.createElement('p')
//     movieOverviewEl.setAttribute('class', 'movie-overview')
// }



getMovieData()