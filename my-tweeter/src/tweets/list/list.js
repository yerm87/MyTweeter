import React, {useEffect, useState} from "react";
import {loadTweets} from "../loadTweets";
import { Tweet } from "../details/details";

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
        loadTweets(props.username, getTweetsData);
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