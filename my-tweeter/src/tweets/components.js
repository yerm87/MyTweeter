import React, { useState, useRef } from "react";
import { createTweet } from './loadTweets';
import { TweetList } from './list/list';
import { CreateTweet } from './create/create';

export const TweetsComponent = props => {
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
                         reference={textAreaRef}/>
            <TweetList newTweet={newTweet} {...props} />
        </div>
    )
}
