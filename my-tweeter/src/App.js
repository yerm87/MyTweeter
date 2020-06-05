import React, { useState, useEffect } from 'react';
import { TweetsComponent } from './tweets/components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { TweetDetailComponent } from './tweets/details/details';

const App = props => {
    return (
        <div className="container">
            <BrowserRouter>
                <Switch>
                    <Route path="/tweets/tweet_data/:tweetid" component={TweetDetailComponent}/>
                    <Route path="/profiles/user/:userId" render={() => <TweetsComponent {...props} />} />
                    <Route path="/" render={() => <TweetsComponent tweetid="95" {...props} />} />
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default App;