let isSearchActive = false;

async function searchTravelRecommendations(event) {
    event.preventDefault();

    const query = document.getElementById('search').value.toLowerCase().trim();
    const path = './travel_recommendation.json';

    if (!query) {
        return;
    }

    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Error Occured: ${response.statusText}`);
        }

        const data = await response.json();
        const resultsContainer = document.getElementById('queryResults');
        const mainContainer = document.getElementById('main');
        const searchBarContainer = document.querySelector('.search-bar');

        resultsContainer.innerHTML = '';

        let foundQueries = [];

        if (query === 'beach' || query === 'beaches') {
            foundQueries = data.beaches;
        } else if (query === 'temple' || query === 'temples') {
            foundQueries = data.temples;
        } else if (query === 'country' || query === 'countries') {
            data.countries.forEach(country => {
                foundQueries = foundQueries.concat(country.cities);
            });
        } else {
            const countrySearch = data.countries.find(country => 
                country.name.toLowerCase() === query
            );

            if (countrySearch) {
                foundQueries = countrySearch.cities;
            }
        }

        isSearchActive = true;
        searchBarContainer.classList.remove('hide-search');
        mainContainer.style.display = 'none';

        if (foundQueries.length > 0) {
            foundQueries.forEach(item => {
                resultsContainer.innerHTML += `
                    <div class="result-card">
                        <h3>${item.name}</h3>
                        <img src="${item.imageUrl}" alt="${item.name}" width="300px">
                        <p>${item.description}</p>
                    </div>`;
            });
        } else {
            resultsContainer.innerHTML = `<h3>Sorry, no results found.</h3>`;
        }

    } catch (error) {
        console.error("Failed to fetch data: ", error)
    }
}

function clearFields() {
    isSearchActive = false;
    document.getElementById('search').value = '';
    document.getElementById('queryResults').innerHTML = '';
    document.getElementById('main').style.display = 'block';
}

document.getElementById('searchForm').addEventListener('submit', searchTravelRecommendations);
document.getElementById('clear-btn').addEventListener('click', clearFields);

const navlinks = document.querySelectorAll('.navlinks a');

navlinks.forEach(link => {
    link.addEventListener('click', clearFields);
});

const homeSection = document.getElementById('home');
const searchBarContainer = document.querySelector('.search-bar');

const observerOptions = {
    root: null,
    threshold: 0.15
};

const homeObserver = new IntersectionObserver(function(entries) {
    if (isSearchActive) return;

    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            searchBarContainer.classList.add('hide-search');
        } else {
            searchBarContainer.classList.remove('hide-search');
        }
    });
}, observerOptions);

if (homeSection) {
    homeObserver.observe(homeSection);
}