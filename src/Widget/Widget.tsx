import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import CognigyCopilot from '../components/CognigyCopilot';

class widgetComp extends HTMLElement {
    connectedCallback() {
        const interactionId = this.getAttribute('interactionid');
        console.log('interaction ID ===================> ', interactionId);
        render(createElement(CognigyCopilot, { interactionId }), this);
    }

    disconnectedCallback() {
        unmountComponentAtNode(CognigyCopilot as any);
    }
}

customElements.define('cognigy-copilot-react-widget', widgetComp);
