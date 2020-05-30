const tweets = document.querySelector('#tweets');

        const handleLikeBtn = (tweet_id) => {
            const url = `tweets/${tweet_id}?action=like`;
            const method = 'GET';

            const xhr = new XMLHttpRequest()
            xhr.open(method, url);
            xhr.responseType = 'json';
            xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
                const likeButton = document.querySelector('#like-button');
                const count = xhr.response.likes;
                likeButton.textContent = `${count} Likes`;
            }
            xhr.send()
        }

        const LikeBtn = (tweet_id, likes_count) => {
            return `<button class="btn btn-primary" id="like-button"
                    onclick="handleLikeBtn(${tweet_id}, ${likes_count})">${likes_count} Likes</button>`
        }

        const RetweetBtn = (tweet_id) => {
            return `<button class="btn btn-outline-success"
                            onclick="retweetBtnHandler(${tweet_id})">Retweet</button>`
        }

        const formatTweet = tweet => {
            const item = `<div class="col-12 col-md-10 mx-auto border rounded py-3 mb-4 tweet" id="tweet-${tweet.id}"><h1>${tweet.id}</h1>
                            <p>${tweet.content}</p>
                            <div class="group-btn">${LikeBtn(tweet.id, tweet.likes)}
                            ${RetweetBtn(tweet.id)}</div></div>`;
            return item;
        }

        const retweetBtnHandler = (tweet_id) => {
            const url = `/tweets/${tweet_id}?action=retweet`
            const method = 'GET'

            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.open(method, url);
            xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
                const content = tweets.innerHTML;
                const newTweet = xhr.response;
                const newHtmlElement = formatTweet(newTweet);
                tweets.innerHTML = newHtmlElement + content;
            }
            xhr.send();
        }

        const loadTweets = (tweetsWrapper) => {
            const xhr = new XMLHttpRequest();
            const responseType = 'json';
            const method = 'GET';
            const url = '/tweets';

            xhr.responseType = responseType;
            xhr.open(method, url);
            xhr.onload = () => {
                const serverResponse = xhr.response;
                const listItems = serverResponse.data;

                let stringOfItems = '';
                for(let i=0; i<listItems.length; i++){
                    const item = listItems[i];
                    const element = formatTweet(item);
                    stringOfItems += element;
                }

                tweetsWrapper.innerHTML = stringOfItems;
            }

            xhr.send();
        }

        loadTweets(tweets)

        const errorMessageHandler = (msg, display) => {
            const errorBlock = document.querySelector('#error-block')

            if(display){
                errorBlock.setAttribute('class', 'd-block alert alert-danger');
                errorBlock.textContent = msg;
            } else {
                errorBlock.setAttribute('class', 'd-none alert alert-danger');
            }
        }

        const tweetFormOnSubmitHandler = event => {
            event.preventDefault();

            const myForm = event.target;
            const formData = new FormData(myForm);

            const url = myForm.getAttribute('action');
            const method = myForm.getAttribute('method');
            const responseType = 'json';

            const xhr = new XMLHttpRequest();
            xhr.responseType = responseType;
            xhr.open(method, url);
            xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.onload = () => {
                if(xhr.status === 201){
                    errorMessageHandler('', false);
                    let elements = tweets.innerHTML;
                    const newTweet = xhr.response;
                    const newTweetInDom = formatTweet(newTweet);
                    tweets.innerHTML = newTweetInDom + elements;
                    myForm.reset();
                }
                if(xhr.status === 400){
                    let errorContent;
                    errorContent = xhr.response.content;

                    let errorMessage;
                    if(errorContent){
                        errorMessage = errorContent[0];
                        if(errorMessage){
                            errorMessageHandler(errorMessage, true)
                        } else {
                            alert('Error is occurred. Please try again')
                        }
                    } else {
                        alert('Error is occurred. Please try again')
                    }
                }
                if(xhr.status === 401){
                    alert('You need to log-in');
                    window.location.href = '/login';
                }
            }
            xhr.onerror = () => {
                alert('no network connection')
            }
            xhr.send(formData)
        }

        const tweetForm = document.querySelector('#create-tweet-form')
        tweetForm.addEventListener('submit', tweetFormOnSubmitHandler)