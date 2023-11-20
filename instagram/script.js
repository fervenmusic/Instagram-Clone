let posts = JSON.parse(localStorage.getItem('posts')) || [
    {
        "profile-image": "img/aveha.png",
        "username": "avehamusic",
        "post-image": "img/single.png",
        "likes": ['felven', 'daemenmusic', 'behance'],
        "post-description": "new single out now!",
        "comments": ['behance: liked as soon as i saw it!', 'felven: same!'],
        "likedBy": ['felven', 'daemenmusic', 'behance']
    }
    ,
    {
        "profile-image": "img/behance.png",
        "username": "behance",
        "post-image": "img/piano.png",
        "likes": ['pelaceofficial'],
        "post-description": "really like this melody i just made! :D",
        "comments": ['felven: nice one!', 'pelaceofficial: keep it up!'],
        "likedBy": ['pelaceofficial']
    }

    ,
    {
        "profile-image": "img/felven.png",
        "username": "felven",
        "post-image": "img/inspiration.png",
        "likes": [],
        "post-description": "inspirational...",
        "comments": [],
        "likedBy": []
    }
    ,
    {
        "profile-image": "img/pelace.png",
        "username": "pelaceofficial",
        "post-image": "img/support.png",
        "likes": ['felven', 'avehamusic', 'daemenmusic'],
        "post-description": "thanks for the support my friends!",
        "comments": ['daemenmusic: <3'],
        "likedBy": ['felven', 'avehamusic', 'daemenmusic']
    }
    ,
    {
        "profile-image": "img/daemen.png",
        "username": "daemenmusic",
        "post-image": "img/guitar.png",
        "likes": ['felven'],
        "post-description": "just got this new guitar!",
        "comments": ['felven: looks nice! what brand is it?'],
        "likedBy": ['felven']
    }
]

function persistData() {
    localStorage.setItem('posts', JSON.stringify(posts));
}


function addLike(index) {
    const currentUserIndex = getCurrentUserIndex();
    const currentUser = posts[currentUserIndex]['username'];
    const post = posts[index];
    const likedByCurrentUser = post.likedBy.includes(currentUser);

    if (likedByCurrentUser) {
        post['likedBy'] = post.likedBy.filter(user => user !== currentUser);
        post['likes'].pop();
    } else {
        post['likedBy'].push(currentUser);
        post['likes'].push(currentUser);
    }
    persistData();
    render();
}

function toggleFollow(i, isFollow) {
    document.getElementById(`follow-button${i}`).classList.toggle('hide', isFollow);
    document.getElementById(`unfollow-button${i}`).classList.toggle('hide', !isFollow);
    document.getElementById(`unfollow-button${i}`).classList.toggle('addColor', isFollow);
}

function handleEnter(event, index) {
    event.preventDefault();
    addComment(index);
}

function renderPeopleToFollow() {
    let suggestedContainer = document.querySelector('.suggested-container');
    let suggestedUsers = '';

    for (let i = 0; i < posts.length; i++) {
        if (i === getCurrentUserIndex()) continue;

        suggestedUsers += `
            <div class="suggested-user">
                <img src="${posts[i]['profile-image']}" alt="profile image" class="suggested-user-icon">
                <span>${posts[i]['username']}</span>
                <button class="follow-button" onclick="toggleFollow(${i}, true)" id="follow-button${i}">Follow</button>
                <button class="follow-button hide" onclick="toggleFollow(${i}, false)" id="unfollow-button${i}">Following</button>
            </div>
        `;
    }

    suggestedContainer.innerHTML = '<p>Suggested for you</p>' + suggestedUsers;
}

function switchUser(index) {
    setCurrentUserIndex(index);
    toggleSwitchUser()
    render();
}

function renderSwitchUsers() {
    let switchUserList = document.querySelector('.switch-user-list');
    switchUserList.innerHTML = '';

    for (let i = 0; i < posts.length; i++) {
        switchUserList.innerHTML += `<div class="switch-to-hide">
            <h3>Switch to ${posts[i]['username']}</h3>
            </div>
            <div class="switch-user-item" onclick="switchUser(${i})">
                <img src="${posts[i]['profile-image']}" alt="profile image" class="switch-user-icon">
                <span>${posts[i]['username']}</span>
            </div>
        `;
    }
}

function setCurrentUserIndex(index) {
    localStorage.setItem('currentUserIndex', index);
}

function getCurrentUserIndex() {
    const currentUserIndex = localStorage.getItem('currentUserIndex');
    return currentUserIndex === null ? 0 : parseFloat(currentUserIndex);
}

function toggleSwitchUser() {
    const blur = document.getElementById('blur');
    const switchUser = document.getElementById('switch-user');

    if (blur.classList.contains('blur')) {
        blur.classList.remove('blur');
        switchUser.classList.add('display-none');
    } else {
        blur.classList.add('blur');
        switchUser.classList.remove('display-none');
        renderSwitchUsers();
    }
}

function renderCurrentUserImage() {
    const currentUserIndex = getCurrentUserIndex();
    let currentUserImages = document.querySelectorAll('.current-user-image');

    for (let i = 0; i < currentUserImages.length; i++) {
        currentUserImages[i].innerHTML = `<div class="sidebar-item">
        <img src="${posts[currentUserIndex]['profile-image']}" alt="profile image" class="sidebar-item-profile-image" onclick="toggleSwitchUser()">
        <h3 onclick="toggleSwitchUser()">Profile</h3>
        </div>
        `;
    }
}

function renderCurrentUser() {
    const currentUserIndex = getCurrentUserIndex();
    let currentUser = document.getElementById('current-user');
    currentUser.innerHTML = `<div class="current-user">
    <img src="${posts[currentUserIndex]['profile-image']}" alt="profile image" class="profile-image">
    <span><b>${posts[currentUserIndex]['username']}</span></b>
    <button onclick="toggleSwitchUser()">Switch User</button>
    </div>`;
}

function deleteComment(index, commentIndex) {
    posts[index]['comments'].splice(commentIndex, 1);
    persistData();
    render();
}

function addComment(index) {
    const currentUserIndex = getCurrentUserIndex();
    let input = document.getElementById(`input${index}`).value;
    posts[index]['comments'].push(`${posts[currentUserIndex]['username']}: ${input}`);
    persistData();
    render();
}

function renderPostComments(i, post, currentUser) {
    let commentsHTML = '';

    for (let j = 0; j < post['comments'].length; j++) {
        const comment = post['comments'][j];
        const commentAuthor = comment.split(':')[0];
        const trashIcon = currentUser === commentAuthor ? `
        <img src="icons/trash.svg" class="trash-icon" onclick="deleteComment(${i}, ${j})" id="trashcan">
        ` : '';

        commentsHTML += `<div class="post-comments">
            <div class="post-comment">
                <span>${comment}</span>
                ${trashIcon}
            </div>
        </div>`;
    }

    return commentsHTML;
}

function renderPostContent(i, post, currentUser, currentUserIndex) {
    const likedByCurrentUser = post['likedBy'].includes(currentUser);
    const likeButtonSrc = likedByCurrentUser ? "icons/heartfilled.svg" : "icons/heart.svg";
    if (likedByCurrentUser && !post.likedBy.includes(currentUserIndex)) {
        post.likedBy.push(currentUserIndex);
    }

    return `
        <div class="post">
            <div class="post-header">
                <img src="${post['profile-image']}" alt="profile image" class="profile-image">
                <span><b>${post['username']}</span></b>
            </div>
            <div>
                <img src="${post['post-image']}" alt="post image" class="post-image">
            </div>
            <div class="post-icons">
                <img src="${likeButtonSrc}" onclick="addLike(${i})" id="likebutton${i}">
                <img src="icons/message.svg">
                <img src="icons/messages.svg">
            </div>
            <div class="post-footer">
                <div class="post-likes">
                    <span>${post['likes'].length} likes</span>
                </div>
                <div class="post-description">
                    <span><b>${post['username']}</span></b>
                    <span>${post['post-description']}</span>
                </div>
                <div id="post-comments${i}">
                </div>
                <div class="post-comment">
                    <form id="form${i}" onsubmit="handleEnter(event, ${i}); return false">
                        <input id="input${i}" type="text" placeholder="Add Comment" required />
                        <button type="submit" style="display:none;"></button>
                    </form>
                </div>
            </div>
        `;
}

function render() {
    renderCurrentUserImage();
    renderCurrentUser();
    renderPeopleToFollow();

    const currentUserIndex = getCurrentUserIndex();
    const currentUser = posts[currentUserIndex]['username'];
    let content = document.getElementById('posts');
    content.innerHTML = '';

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        post['likedBy'] = post['likedBy'] || [];
        
        content.innerHTML += renderPostContent(i, post, currentUser, currentUserIndex);
        let postComments = document.getElementById(`post-comments${i}`);
        postComments.innerHTML = renderPostComments(i, post, currentUser);
    }
}
render();