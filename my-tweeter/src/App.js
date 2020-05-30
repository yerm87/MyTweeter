import React, { useState, useEffect } from 'react';
import { TweetList } from './tweets/components';

const App = () => {
    return (
        <div className="container">
            <TweetList />
        </div>
    )
}

export default App;