import React, { useState, useEffect } from 'react';
import { TweetsComponent } from './tweets/components';

const App = () => {
    return (
        <div className="container">
            <TweetsComponent />
        </div>
    )
}

export default App;