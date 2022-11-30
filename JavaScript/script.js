var bodyEl = document.querySelector('body')
var movieCardEl = document.createElement('div')
movieCardEl.setAttribute('class', 'movie-card')
bodyEl.appendChild(movieCardEl)

var searchFilter = ""

var getApi = function (movieTitle) {
    searchFilter = 'movie/157336'
    var requestUrl = 'https://api.themoviedb.org/3/' + searchFilter + '?api_key=337b93ffd45a2b68e431aed64d687099&append_to_response=videos,images'

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    generatePoster(data)
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log('something is wrong');
        });
};

function generatePoster(moviePoster) {
    var posterUrl = moviePoster.poster_path;
    if (!posterUrl) {
        console.log('No poster found')
        return;
    } else {
        var posterEl = document.createElement('img')
        posterEl.setAttribute('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/' + posterUrl)
        movieCardEl.appendChild(posterEl)
    }
    console.log(posterUrl)
    console.log(posterEl)
    console.log(movieCardEl)
}





getApi()