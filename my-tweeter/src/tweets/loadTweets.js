function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const lookup = (endpoint, usedMethod, callback, data) => {
    let jsonData;
    if(data){
        jsonData = data
    }

    const xhr = new XMLHttpRequest();
    const responseType = 'json';
    const method = usedMethod;
    const url = `http://localhost:8000${endpoint}`;

    xhr.responseType = responseType;
    xhr.open(method, url);
    var csrftoken = getCookie('csrftoken');

    xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    if(usedMethod === 'POST'){
        xhr.setRequestHeader("X-CSRFToken", csrftoken)
    }
    xhr.onload = () => {
        callback(xhr.response, xhr.status)
        console.log(xhr.response);
    }
    xhr.onerror = () => {
        const response = { msg: 'error occurred' }
        callback(response, xhr.status)
    }

    xhr.send(jsonData);
}

export const loadTweets = (username, callback) => {
    let endpoint = '/tweets/';
    if(username){
        endpoint = `/tweets/?username=${username}`
    }
    lookup(endpoint, 'GET', callback);
}

export const createTweet = (callback, value) => {
    const formData = new FormData();
    formData.append('next', '/')
    formData.append('content', value)
    lookup('/create-tweet/', 'POST', callback, formData);
}

export const likeAndRetweetHandler = (tweetId, action, callback) => {
    const url = `tweets/${tweetId}?action=${action}`;
    const method = 'GET';

    const xhr = new XMLHttpRequest()
    xhr.open(method, url);
    xhr.responseType = 'json';
    xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        callback(xhr.response, xhr.status);
    }
    xhr.send()
}

export const getTweet = (tweetId, callback) => {
    const endpoint = `/tweets/tweet_data/${tweetId}`;
    lookup(endpoint, 'GET', callback)
}