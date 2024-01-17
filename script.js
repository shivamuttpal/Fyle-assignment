let currentPage = 1;
let perPage = 10;
let totalRepositories = 0;

function fetchRepositories() {
    const username = document.getElementById('username').value;
    perPage = parseInt(document.getElementById('perPage').value);
    const searchQuery = document.getElementById('searchQuery').value;

    if (!username) {
        alert('Please enter a GitHub username.');
        return;
    }

    showLoader();

    // Make API call to fetch repositories based on the username, currentPage, perPage, and searchQuery

    let apiUrl = `https://api.github.com/search/repositories?q=user:${username}`;

    if (searchQuery) {
        apiUrl += `+${searchQuery}`;
    }

    apiUrl += `&page=${currentPage}&per_page=${perPage}`;

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function (data) {
            hideLoader();
            const repositories = data.items || [];
            displayRepositories(repositories);
            updatePagination(data.total_count || repositories.length);
        },
        error: function () {
            hideLoader();
            alert('Error fetching repositories. Please try again.');
        }
    });
}
function fetchUserInfo(username) {
    const userInfoUrl = `https://api.github.com/users/${username}`;

    $.ajax({
        url: userInfoUrl,
        method: 'GET',
        success: function (userData) {
            displayUserInfo(userData);
        },
        error: function () {
            console.error('Error fetching user information.');
        }
    });
}

function displayUserInfo(userData) {
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userBio = document.getElementById('user-bio');
    const userLocation = document.getElementById('user-location');
    const userReposLink = document.getElementById('user-repos-link');
    const userGithubLink = document.getElementById('user-github-link');

    userAvatar.src = userData.avatar_url;
    userName.textContent = userData.name || userData.login;
    userBio.textContent = userData.bio || 'No bio available';
    userLocation.textContent = userData.location || 'Location not specified';

    userReposLink.href = `https://github.com/${userData.login}?tab=repositories`;
    userGithubLink.href = userData.html_url;
}


function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById('repositories');
    repositoriesContainer.innerHTML = '';

    repositories.forEach(repository => {
        const repositoryCard = document.createElement('div');
        repositoryCard.className = 'col-md-4 repository-card';

        const repositoryHtml = `
            <img src="${repository.owner.avatar_url}" alt="Owner Avatar">
            <strong>${repository.name}</strong><br>
            <small>${repository.description || 'No description available'}</small><br>
            <a href="${repository.html_url}" target="_blank">View on GitHub</a>
        `;

        repositoryCard.innerHTML = repositoryHtml;
        repositoriesContainer.appendChild(repositoryCard);
    });
}

function updatePagination(totalCount) {
    totalRepositories = totalCount;

    const totalPages = Math.ceil(totalRepositories / perPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${currentPage === i ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" onclick="changePage(${i})">${i}</a>`;
        paginationContainer.appendChild(pageItem);
    }
}

function changePage(page) {
    currentPage = page;
    fetchRepositories();
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}
