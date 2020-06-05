import React, {useState, useEffect} from "react";
import {likeAndRetweetHandler} from "../loadTweets";
import { withRouter, Link } from 'react-router-dom';
import { getProfileData, followAction } from '../loadTweets';

export const LikeBtn = props => {
    const [like, setLike] = useState(props.tweet.likes)
    const setLikeOnClick = (response, status) => {
        if(status === 200){
            setLike(response.likes)
            props.tweet.likes = response.likes;
        } else if(status === 401){
            window.location.href = '/login'
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
        } else if(status === 401){
            window.location.href = '/login';
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

export const MyTweetsButton = props => {

    return (
        <div className="text-center">
            <button className="btn btn-primary mx-auto col-3"
                    onClick={props.clickHandler}>{props.name}</button>
        </div>
    )
}

export const TweetBackButton = withRouter(BackButton);

export const Followers = props => {
    const [followers, setFollowers] = useState(null);
    const [doFollow, setDoFollow] = useState(null);
    const [profile, setProfile] = useState(null)
    let {username, buttonName} = props;

    const profileDataHandler = (response, status) => {
        if(status === 200){
            const followers_number = response.profile.followers_count;
            setFollowers(followers_number)
            setProfile(response.profile);
        }
    }

    useEffect(() => {
        getProfileData(username, profileDataHandler)
        setDoFollow(buttonName)
    }, [])

    const handler = (response, status) => {
        let countFollower = followers;
        if(doFollow === 'unfollow'){
            countFollower = countFollower - 1;
            setDoFollow('follow');
            setFollowers(countFollower);
        } else {
            countFollower = countFollower + 1;
            setDoFollow('unfollow');
            setFollowers(countFollower);
        }

    }

    const followUnfollow = event => {
        event.preventDefault();
        if(doFollow === 'unfollow'){
            followAction(username, 'unfollow', handler)
        } else {
            followAction(username, 'follow', handler)
        }
    }

    return (
        <div className="text-center bg-secondary text-white">
            {profile !== null ? (<div className="text-center">
                <p>
                    {`${profile.first_name === null ? '' : profile.first_name} ${profile.last_name === null ? '' : profile.last_name} @${profile.username}`}
                </p>
                <p>{`Bio: ${profile.bio === null ? '' : profile.bio}`}</p>
                <p>{`Location: ${profile.location === null ? '' : profile.location}`}</p>
                <p>{`Following: ${profile.following}`}</p>
            </div>) : null}
            <button className="btn-primary">Followers: {followers}</button>
            <button id="follow" className="btn-primary"
                    onClick={(event) => followUnfollow(event)}>{doFollow}</button>
        </div>
    )
}