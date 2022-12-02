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
                    // generatePoster(data);
                    generateInfo(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log('something is wrong');
        });
};

// function generatePoster(movieData) {
//     for (let i = 0; i < movieData.results.length; i++) {
//         var posterUrl = movieData.results[i].poster_path;
//         var movieCardEl = document.createElement('div');
//         movieCardEl.setAttribute('class', 'movie-card');
//         movieCardEl.style.border = '1px solid black';
//         bodyEl.appendChild(movieCardEl);
//         if (!posterUrl) {
//             console.log('No poster found');
//             return;
//         } else {
//             var posterEl = document.createElement('img');
//             posterEl.setAttribute('class', 'movie-poster')
//             posterEl.setAttribute('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/' + posterUrl);
//             movieCardEl.appendChild(posterEl);
//         };
//         console.log(posterUrl)
//         console.log(posterEl)
//         console.log(movieCardEl)
//     }
// };

function generateInfo(movieData) {
    // getting movie info from TMDB API and save in an object and local storage

    for (let i = 0; i < movieData.results.length; i++) {
        const movieInfo = {
            title: movieData.results[i].original_title,
            overview: movieData.results[i].overview,
            releaseDate: movieData.results[i].release_date,
            runtimeHour: Math.floor((movieData.results[i].runtime) / 60),
            runtimeMinute: (movieData.results[i].runtime) % 60,
            rating: movieData.results[i].vote_average,
            posterPath: movieData.results[i].poster_path,
        };
        // stringfy the movieInfo object
        const movieInfoString = JSON.stringify(movieInfo);
        localStorage.setItem('movie_' + [i], movieInfoString);
        console.log(movieInfo)
        var movieCardEl = document.createElement('div');
        movieCardEl.setAttribute('class', 'movie-card row');
        movieCardEl.style.border = '1px solid black';
        movieCardEl.style.display = 'block';
        var cardcolumEl = document.createElement('div');
        cardcolumEl.setAttribute('class', 'col s12 m7');
        movieCardEl.appendChild.cardcolumEl
        var moviePosterEl = document.createElement('div');
        moviePosterEl.setAttribute('class', 'card');
        cardcolumEl.appendChild.moviePosterEl;
        var movieImageEl = document.createElement('div');
        movieImageEl.setAttribute('')

        if (!movieInfo.posterPath) {
            console.log('No poster found');
            return;
        } else {
            var posterEl = document.createElement('img');
            posterEl.setAttribute('class', 'movie-poster')
            posterEl.setAttribute('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/' + movieInfo.posterPath);
        };
        console.log(movieInfo.posterPath)
        console.log(posterEl)
        console.log(movieCardEl)

        // generate elements to show movie info 
        var movieInfoEl = document.createElement('div');
        movieInfoEl.setAttribute('class', 'movie-info');
        movieInfoEl.setAttribute('float', 'left');
        // create h2 for movie title
        var movieTitleEl = document.createElement('span');
        movieTitleEl.setAttribute('class', 'movie-title card-title');
        movieTitleEl.innerHTML = movieInfo.title;
        moviePosterEl.appendChild(movieTitleEl);
        // create p for movie overview
        var movieOverviewEl = document.createElement('p');
        movieOverviewEl.setAttribute('class', 'movie-overview card-content');
        movieOverviewEl.textContent = movieInfo.overview;
        moviePosterEl.appendChild(movieOverviewEl);
        // create ul for the other movie info
        var movieInfoUlEl = document.createElement('ul');
        movieInfoUlEl.setAttribute('class', 'movie-info-ul');
        movieInfoUlEl.style.listStyleType = 'none';
        var releaseDateEl = document.createElement('li');
        releaseDateEl.setAttribute('float', 'left');
        releaseDateEl.textContent = movieInfo.releaseDate;
        var runtimeEl = document.createElement('li');
        runtimeEl.setAttribute('float', 'left');
        runtimeEl.textContent = movieInfo.runtimeHour + ' h ' + movieInfo.runtimeMinute + ' min';
        var ratingEl = document.createElement('li');
        ratingEl.setAttribute('float', 'left');
        ratingEl.textContent = 'TMDB score: ' + movieInfo.rating;
        movieInfoUlEl.appendChild(releaseDateEl);
        movieInfoUlEl.appendChild(runtimeEl);
        movieInfoUlEl.appendChild(ratingEl);
        movieInfoEl.appendChild(movieInfoUlEl);
        moviePosterEl.appendChild(posterEl);
        movieCardEl.appendChild(movieInfoEl);
        bodyEl.appendChild(movieCardEl);

    };

};

var questions = [
    {
        question: 'How are you feeling today?',
        answers: [
            { text: 'Happy' },
            { text: 'Neutral' },
            { text: 'Sad' }

        ]
    },
    {
        question: 'What is the occation?',
        answers: [
            { text: 'Alone time' },
            { text: 'On a date' },
            { text: 'With friends' },
            {text: 'With family'}
        ]
    },
    {
        question: 'What genre would you like?',
        answers: [
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
        question: 'How old would you like the movie to be?',
        answers: [
            { text: 'One year or less' },
            { text: 'Five years or less' },
            { text: 'Ten years or less' },
            { text: 'Twenty years or less' }
        ]
    },
    {
        question: 'How long would would you like the movie to be?',
        answers: [
            { text: 'Up to 2 hours' },
            { text: 'Up to 3 hours' },
            { text: 'Up to 4 hours' }
        ]
    }
]
getMovieData()