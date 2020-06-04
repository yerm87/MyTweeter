import {LikeBtn, RetweetBtn, TweetDetailsButton, TweetBackButton} from "../buttons/buttons";
import React, { useState, useEffect } from "react";
import { getTweet, loadTweets } from '../loadTweets';

export const UserPicture = props => {
    const {user} = props;

    return (
        <span className="px-3 py-2 rounded-circle bg-dark mx-1 text-white">
            {user.username ? user.username[0] : null}
        </span>
    )
}

export const UserLink = props => {
    const {user, includeFullName} = props
    const nameDisplay = includeFullName ? `${user.first_name} ${user.last_name}` : null

    const handleClick = event => {
        window.location.href = `/profiles/user/${user.username}`;
    }

    return (
        <p className="text-secondary">
            {nameDisplay} <span onClick={(event) => handleClick(event)}>@{`${user.username}`}
            </span>
        </p>
    )
}

export const Tweet = props => {
    const {tweet} = props;
    const first_name = tweet.user.first_name ? tweet.user.first_name : null;
    const last_name = tweet.user.last_name ? tweet.user.last_name : null;
    const username = tweet.user.username ? tweet.user.username : null;
    let tweetElement = (
        <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
            <div className="d-flex">
                <div className="col-1">
                    <UserPicture user={tweet.user} />
                </div>
                <div className="col-11">
                    <UserLink user={tweet.user} includeFullName />
                    <p className="mb-3">{tweet.content}</p>
                    <LikeBtn tweet={tweet} />
                    <RetweetBtn tweet={tweet}
                                allTweets={props.allTweets}
                                setTweets={props.setTweets}/>
                                <TweetDetailsButton tweet={tweet} />
                </div>
            </div>
        </div>
    )
    const tweetParent = tweet.parent !== null ? tweet.parent : null;
    if(tweetParent){
        const tweetParentData = props.allTweets.find(element => element.id === tweetParent)
        console.log(tweetParentData)
        const first_name = tweetParentData.user.first_name ? tweetParentData.user.first_name : null;
        const last_name = tweetParentData.user.last_name ? tweetParentData.user.last_name : null;
        const username = tweetParentData.user.username ? tweetParentData.user.username : null;
        tweetElement = (
            <div className="col-12 col-md-8 mx-auto border my-3 py-3 rounded">
                <div className="d-flex">
                    <div className="col-1">
                        <UserPicture user={tweet.user} />
                    </div>
                    <div className="col-11">
                        <UserLink user={tweet.user} includeFullName />
                    </div>
                </div>
                <div className="d-flex mt-4">
                    <div className="col-1"></div>
                    <div className="col-11 mx-auto border my-3 py-3 rounded">
                        <span className="text-secondary">Retweet via @{username}</span>
                        <div className="d-flex mt-2">
                            <div className="col-1">
                                <UserPicture user={tweetParentData.user} includeFullName />
                            </div>
                            <div className="col-11">
                                <p className="text-secondary">
                                    <UserLink user={tweetParentData.user} includeFullName />
                                </p>
                                <p>{tweetParentData.content}</p>
                             </div>
                        </div>
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
            console.log(response.data);
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