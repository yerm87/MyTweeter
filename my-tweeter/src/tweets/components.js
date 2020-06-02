import React, { useState, useRef } from "react";
import { createTweet } from './loadTweets';
import { TweetList } from './list/list';
import { CreateTweet } from './create/create';

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

    return (
        <div>
            <CreateTweet permission={props.permission}
                         submitHandler={(event) => handleFormSubmit(event)}
                         reference={textAreaRef}
                         errorMessage={error}/>
            <TweetList newTweet={newTweet} {...props} />
        </div>
    )
}
