import React from 'react';
import './App.css';
import CognigyCopilot from './components/CognigyCopilot';
import '@avaya/neo-react/avaya-neo-react.css';
function App() {
    return (
        <div className='App'>
            <CognigyCopilot interactionId='placeHolderInteractionID' />
        </div>
    );
}

export default App;
