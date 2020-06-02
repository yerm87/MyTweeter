import {LikeBtn, RetweetBtn, TweetDetailsButton, TweetBackButton} from "../buttons/buttons";
import React, { useState, useEffect } from "react";
import { getTweet, loadTweets } from '../loadTweets';

export const Tweet = props => {
    const {tweet} = props;
    let tweetElement = (
        <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
            <p>{tweet.content}</p>
            <LikeBtn tweet={tweet} />
            <RetweetBtn tweet={tweet}
                        allTweets={props.allTweets}
                        setTweets={props.setTweets}/>
                        <TweetDetailsButton tweet={tweet} />
        </div>
    )
    const tweetParent = tweet.parent !== null ? tweet.parent : null;
    if(tweetParent){
        const tweetParentData = props.allTweets.find(element => element.id === tweetParent)
        tweetElement = (
            <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
                <p>Retweet</p>
                <div className="row">
                    <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
                        <p>{tweetParentData.content}</p>
                    </div>
                </div>
                <LikeBtn tweet={props.tweet} />
                <RetweetBtn tweet={tweet}
                            allTweets={props.allTweets}
                            setTweets={props.setTweets}/>
                            <TweetDetailsButton tweet={tweet} />
            </div>
        )
    }

    return tweetElement
}

export const TweetDetailComponent = props => {
    const [tweets, setTweets] = useState([]);
    const [tweet, setTweet] = useState(null);
    const {tweetid} = props.match.params;

    const handleTweetDetails = (response, status) => {
        if(status === 200){
            setTweet(response);
        }
    }

    const onLoadTweetsHandler = (response, status) => {
        if(status === 200){
            setTweets(response.data)
        }
    }
    useEffect(() => {
        console.log(props)
        loadTweets(null, onLoadTweetsHandler)
        setTimeout(() =>{
            getTweet(tweetid, handleTweetDetails)
        }, 2000);
    }, [])

    return tweet === null ? null : (<React.Fragment>
                                      <Tweet tweet={tweet}
                                          allTweets={tweets}
                                          setTweets={tweets} />
                                          <TweetBackButton />
                                    </React.Fragment>)
}