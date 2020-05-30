import React, {useEffect, useState, useRef} from "react";
import { loadTweets, createTweet } from './loadTweets';

export const LikeBtn = props => {
    const {tweet} = props
    const [like, setLike] = useState(0);
    const [likeActive, setLikeActive] = useState(false);
    const likesCount = tweet.likes

    const handleClick = event => {
        event.preventDefault();

        if(likeActive){
            setLike(0)
        } else {
            setLike(1)
        }
        setLikeActive(!likeActive);
    }

    return (
        <button className="btn btn-primary" id="like-button"
                onClick={(event) => handleClick(event)}>
                    {like} Likes</button>
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
            <Tweet tweet={tweet} key={`${index} - ${tweet.id}`} />
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
        <div className="row">
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
