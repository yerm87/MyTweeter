import React, {useEffect, useState, useRef} from "react";
import { loadTweets, createTweet, likeAndRetweetHandler } from './loadTweets';

export const LikeBtn = props => {
    const [like, setLike] = useState(props.tweet.likes)
    const setLikeOnClick = (response, status) => {
        if(status === 200){
            setLike(response.likes)
            props.tweet.likes = response.likes;
            console.log(props.tweet)
        }
    }

    const handleLikeButton = (event, tweetId) => {
        event.preventDefault();

        likeAndRetweetHandler(tweetId, 'like', setLikeOnClick);

    }

    return (
        <button className="btn btn-primary" id="like-button"
                onClick={(event) => handleLikeButton(event, props.tweet.id)}>
                    {like} Likes</button>
    )
}

export const RetweetBtn = props => {
    const {tweet} = props

    const setRetweetOnClick = (response, status) => {
        if(status === 201){
            const newTweet = response;
            const newTweets = [newTweet, ...props.allTweets]
            props.setTweets(newTweets);
            console.log(newTweets);
        }
    }

    const handleRetweetButton = (event, tweetId, tweets) => {
        event.preventDefault();
        likeAndRetweetHandler(tweetId, 'retweet', setRetweetOnClick)
    }

    return (
        <button className="btn btn-outline-success"
                onClick={(event) => handleRetweetButton(event, tweet.id)}>Retweet</button>
    )
}

export const Tweet = props => {
    const {tweet, tweets, setLikes} = props;
    let tweetElement = (
        <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
            <p>{tweet.content}</p>
            <LikeBtn tweet={tweet} />
            <RetweetBtn tweet={tweet}
                        allTweets={props.allTweets}
                        setTweets={props.setTweets}/>
        </div>
    )
    const tweetParent = tweet.parent !== null ? tweet.parent : null;
    if(tweetParent){
        const tweetParentData = props.allTweets.find(element => element.id === tweetParent)
        tweetElement = (
            <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
                <p>{tweetParentData.content}</p>
                <div className="row">
                    <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
                        <p>{tweet.content}</p>
                        <LikeBtn tweet={props.tweet} />
                        <RetweetBtn tweet={tweet}
                                    allTweets={props.allTweets}
                                    setTweets={props.setTweets}/>
                    </div>
                </div>
            </div>
        )
    }

    return tweetElement
}

export const TweetList = props => {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        if(props.newTweet !== null){
            const newTweets = [props.newTweet, ...tweets];
            setTweets(newTweets);
        }
    }, [props.newTweet])

    const getTweetsData = (response, status) =>{
        if(status === 200){
            const tweets = response.data
            setTweets(tweets);
        } else {
            alert('Error occurred. Try Again')
        }
    }

    useEffect(() => {
        loadTweets(getTweetsData);
    }, []);

    const tweetItems = tweets.map((tweet, index) => {
        return (
            <Tweet key={`${index} - ${tweet.id}`}
                   tweet={tweet}
                   allTweets={tweets}
                   setTweets={setTweets} />
                   )
    })

    return (
        <div className="row">
            {tweetItems}
        </div>
    )
}

export const TweetsComponent = () => {
    const [ newTweet, setNewTweet ] = useState(null);
    const textAreaRef = useRef(null);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const onResponse = (response, status) => {
            const newTweet = response;
            if(status === 201){
                setNewTweet(newTweet);
            } else {
                alert('Error occurred. Please try again');
                console.log(response);
            }
            console.log(status);
        }
        const value = textAreaRef.current.value;
        createTweet(onResponse, value);

        textAreaRef.current.value = ''
    }

    return (
        <div>
            <form className="form col-10 col-md-8 mt-3 mx-auto"
                  onSubmit={(event) => handleFormSubmit(event)}>
                <div className="alert alert-danger d-none"></div>
                <textarea className="form-control" placeholder="Create tweet"
                          ref={textAreaRef}></textarea>
                <button type="submit" className="btn btn-primary my-3">Save</button>
            </form>
            <TweetList newTweet={newTweet} />
        </div>
    )
}
