document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = "https://api.themoviedb.org/3";
    const apiKey = "9d2bff12ed955c7f1f74b83187f188ae";

    document.getElementById('searchBtn').addEventListener('click', function() {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            searchMovies(query);
        } else {
            alert("검색어를 입력해 주세요.");
        }
    });

    document.getElementById('backBtn').addEventListener('click', function() {
        window.history.back();
    });

    function searchMovies(query) {
        const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => displayMovies(data.results))
            .catch(error => console.error('Error:', error));
    }

    function displayMovies(movies) {
        const moviesList = document.getElementById('moviesList');
        moviesList.innerHTML = '';
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.textContent = movie.title;
            movieElement.style.cursor = 'pointer';
            movieElement.onclick = () => showMovieDetails(movie.id);
            moviesList.appendChild(movieElement);
        });
        document.getElementById('backBtn').style.display = 'none'; // Hide back button here
    }

    function showMovieDetails(movieId) {
        const url = `${baseUrl}/movie/${movieId}?api_key=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const details = document.getElementById('movieDetails');
                details.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}" style="float: left; margin-right: 20px;">
                    <h2>${data.title} (${data.release_date})</h2>
                    <p>${data.overview}</p>
                    <table>
                        <tr><th>Original Title</th><td>${data.original_title}</td></tr>
                        <tr><th>Original Language</th><td>${data.original_language}</td></tr>
                        <tr><th>Adult</th><td>${data.adult ? 'Yes' : 'No'}</td></tr>
                        <tr><th>Popularity</th><td>${data.popularity}</td></tr>
                        <tr><th>Vote Average</th><td>${data.vote_average}</td></tr>
                        <tr><th>Vote Count</th><td>${data.vote_count}</td></tr>
                        <tr><th>Video Released</th><td>${data.video ? 'Yes' : 'No'}</td></tr>
                    </table>
                    <div style="clear: both;"></div>
                `;
                fetchGenres(data.genre_ids);
                fetchMovieClips(movieId); // Fetch and display movie clips
            })
            .catch(error => console.error('Error:', error));
    }
    
    function fetchGenres(genreIds) {
        const genreUrl = `${baseUrl}/genre/movie/list?api_key=${apiKey}`;
        fetch(genreUrl)
            .then(response => response.json())
            .then(genresData => {
                const genres = genresData.genres.filter(genre => genreIds.includes(genre.id)).map(genre => genre.name).join(', ');
                const genresDisplay = document.createElement('tr');
                genresDisplay.innerHTML = `<th>Genres</th><td>${genres}</td>`;
                document.querySelector('#movieDetails table').appendChild(genresDisplay);
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchMovieClips(movieId) {
        const url = `${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const clips = document.getElementById('movieClips');
                clips.innerHTML = '<h3>동영상 클립</h3>';
                data.results.forEach(clip => {
                    if (clip.site === "YouTube") {
                        const clipElement = document.createElement('iframe');
                        clipElement.src = `https://www.youtube.com/embed/${clip.key}`;
                        clipElement.width = '560';
                        clipElement.height = '315';
                        clipElement.allowFullscreen = true;
                        clips.appendChild(clipElement);
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('동영상 클립을 불러오는 데 실패했습니다.');
            });
    }
});
