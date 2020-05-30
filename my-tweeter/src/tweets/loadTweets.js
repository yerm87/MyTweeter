export const loadTweets = (callback) => {
    const xhr = new XMLHttpRequest();
    const responseType = 'json';
    const method = 'GET';
    const url = 'http://localhost:8000/tweets/';

    xhr.responseType = responseType;
    xhr.open(method, url);
    xhr.onload = () => {
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = () => {
        const response = { msg: 'error occurred' }
        callback(response, xhr.status)
    }

    xhr.send();
}