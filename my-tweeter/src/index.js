import ReactDOM from 'react-dom';
import React from 'react'
import App from './App';
import { TweetDetailComponent } from './tweets/details/details';

const createRootComponent = React.createElement;

const htmlElement = document.querySelector('.root')
const pageData = htmlElement.dataset;

ReactDOM.render(createRootComponent(App, pageData), htmlElement);

const tweetDetails = document.querySelectorAll('.tweet-details')

/*
tweetDetails.forEach(element => {
    const data = element.dataset
    ReactDOM.render((createRootComponent(TweetDetailComponent, data)), element);
})*/