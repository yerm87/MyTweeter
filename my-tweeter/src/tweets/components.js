import React, {useEffect, useState} from "react";
import { loadTweets } from './loadTweets';

export const LikeBtn = props => {
    const {tweet} = props
    const likesCount = tweet.likes

    return (
        <button className="btn btn-primary" id="like-button">
                    {likesCount} Likes</button>
    )
}

export const RetweetBtn = props => {
    const {tweet} = props

    return (
        <button className="btn btn-outline-success">Retweet</button>
    )
}

export const Tweet = props => {
    const {tweet} = props
    return (
        <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
            <p>{tweet.content}</p>
            <LikeBtn tweet={tweet} />
            <RetweetBtn tweet={tweet} />
        </div>
    )
}

export const TweetList = () => {
    const [tweets, setTweets] = useState([]);

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
            <Tweet tweet={tweet} key={`${index} - ${tweet.id}`} />
        )
    })

    return (
        <div className="row">
            {tweetItems}
        </div>
    )
}
