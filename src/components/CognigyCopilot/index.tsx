import React from 'react';
import './style.css';
// import CONFIG from '../../utils/config';
import WidgetApiProvider from '../../contexts/WidgetApiContext';
import CognigyCopilotIframe from '../CognigyCopilotIframe';

function CognigyCopilot({ interactionId }) {
    return (
        <WidgetApiProvider interactionId={interactionId}>
            <div className='cognigy-copilot-widget-container'>
                <CognigyCopilotIframe />
            </div>
        </WidgetApiProvider>
    );
}

export default CognigyCopilot;
