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
                        const movieInfoString = JSON.stringify(movieInfo);
                        localStorage.setItem('movie_' + [i], movieInfoString);
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
        posterPath: movieData.poster_path,
        movieID: movieData.id,
    };
    console.log(movieInfo)
    return movieInfo;
    
}


// function generateInfo(movieData) {
//     // getting movie info from TMDB API and save in an object and local storage

//     for (let i = 0; i < movieData.results.length; i++) {
//         const movieInfo = {
//             title: movieData.results[i].original_title,
//             overview: movieData.results[i].overview,
//             releaseDate: movieData.results[i].release_date,
//             runtimeHour: Math.floor((movieData.results[i].runtime) / 60),
//             runtimeMinute: (movieData.results[i].runtime) % 60,
//             rating: movieData.results[i].vote_average,
//             posterPath: movieData.results[i].poster_path,
//             movieID: movieData.results[i].id,
//         };




//         var movieCardEl = document.createElement('div');
//         movieCardEl.setAttribute('class', 'movie-card');
//         movieCardEl.style.border = '1px solid black';
//         movieCardEl.style.display = 'block';

//         if (!movieInfo.posterPath) {
//             console.log('No poster found');
//             return;
//         } else {
//             var posterEl = document.createElement('img');
//             posterEl.setAttribute('class', 'movie-poster')
//             posterEl.setAttribute('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/' + movieInfo.posterPath);
//         };


//         // generate elements to show movie info 
//         var movieInfoEl = document.createElement('div');
//         movieInfoEl.setAttribute('class', 'movie-info');
//         movieInfoEl.setAttribute('float', 'left');
//         // create h2 for movie title
//         var movieTitleEl = document.createElement('h2');
//         movieTitleEl.setAttribute('class', 'movie-title');
//         movieTitleEl.innerHTML = movieInfo.title;
//         movieInfoEl.appendChild(movieTitleEl);
//         // create p for movie overview
//         var movieOverviewEl = document.createElement('p');
//         movieOverviewEl.setAttribute('class', 'movie-overview');
//         movieOverviewEl.textContent = movieInfo.overview;
//         movieInfoEl.appendChild(movieOverviewEl);
//         // create ul for the other movie info
//         var movieInfoUlEl = document.createElement('ul');
//         movieInfoUlEl.setAttribute('class', 'movie-info-ul');
//         movieInfoUlEl.style.listStyleType = 'none';
//         var releaseDateEl = document.createElement('li');
//         releaseDateEl.setAttribute('float', 'left');
//         releaseDateEl.textContent = movieInfo.releaseDate;
//         var runtimeEl = document.createElement('li');
//         runtimeEl.setAttribute('float', 'left');
//         runtimeEl.textContent = movieInfo.runtimeHour + ' h ' + movieInfo.runtimeMinute + ' min';
//         var ratingEl = document.createElement('li');
//         ratingEl.setAttribute('float', 'left');
//         ratingEl.textContent = 'TMDB score: ' + movieInfo.rating;
//         movieInfoUlEl.appendChild(releaseDateEl);
//         movieInfoUlEl.appendChild(runtimeEl);
//         movieInfoUlEl.appendChild(ratingEl);
//         movieInfoEl.appendChild(movieInfoUlEl);
//         movieInfoEl.appendChild(posterEl);
//         movieCardEl.appendChild(movieInfoEl);
//         bodyEl.appendChild(movieCardEl);

//     };

// }


getMovieData()