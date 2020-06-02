import React, {useState} from "react";
import {likeAndRetweetHandler} from "../loadTweets";
import { withRouter } from 'react-router-dom';

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

const TweetDetails = props => {
    const {tweet} = props
    const navigate = () => {
        props.history.push(`/tweets/tweet_data/${tweet.id}`)
    }
    return (
        <button className="btn btn-outline-primary"
                 onClick={navigate}>View Details</button>
    )
}

export const TweetDetailsButton = withRouter(TweetDetails);

const BackButton = props => {
    const handler = () => {
        props.history.goBack();
    }
    return (
        <div className="text-center">
            <button className="btn btn-primary col-md-6 my-4"
                    onClick={handler}>Back</button>
        </div>
    )
}

export const TweetBackButton = withRouter(BackButton);