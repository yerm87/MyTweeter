import React, { useState, useRef } from "react";
import { createTweet } from './loadTweets';
import { TweetList } from './list/list';
import { CreateTweet } from './create/create';
import { MyTweetsButton, Followers } from './buttons/buttons';

export const TweetsComponent = props => {
    const [ newTweet, setNewTweet ] = useState(null);
    const [error, setError] = useState(false);
    const textAreaRef = useRef(null);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const onResponse = (response, status) => {
            const newTweet = response;
            if(status === 201){
                setNewTweet(newTweet);
                setError(false);
            } else if(status === 401){
                window.location.href = '/login';
            } else if(status === 400){
                setError(true);
            }
        }
        const value = textAreaRef.current.value;
        createTweet(onResponse, value);

        textAreaRef.current.value = ''
    }

    const homepage = props.homepage === 'true' ? true : false;
    const name = homepage ? 'My Feed' : 'Back to All Tweets'

    const myFeedNavigation = () => {
        let endpoint;
        if(homepage){
            endpoint = `profiles/user/${props.username}`;
        } else {
            endpoint = '/';
        }

        window.location.href = endpoint
    }

    const show = props.show === 'True' ? true : false

    return (
        <div>
            {show ? (
                <Followers username={props.username}
                           buttonName={props.follow} />
            ) : null}
            <CreateTweet permission={props.permission}
                         submitHandler={(event) => handleFormSubmit(event)}
                         reference={textAreaRef}
                         errorMessage={error}/>
            {props.username ? <MyTweetsButton name={name}
                                              clickHandler={() => myFeedNavigation()}/>
                                              : null}
            <TweetList newTweet={newTweet} {...props} />
        </div>
    )
}
