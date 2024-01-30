import React, { useEffect, useState } from 'react';
import { useWidgetApi } from '../../contexts/WidgetApiContext';

const CognigyCopilotIframe = () => {
    const [copilotUrl, setCopilotUrl] = useState('');
    const { widgetApi, interactionId, apiInteractionData } = useWidgetApi();

    console.log(
        'wipi=> ',
        widgetApi,
        ' inid==> ',
        interactionId,
        '===apiInteractionData===',
        apiInteractionData,
    );

    // let interData = widgetApi?.getInteractionData();
    // console.log('CognigyCopilot getInteractionData=======> ', interactionData);

    useEffect(() => {
        // let interData = widgetApi?.getInteractionData();
        console.log('CognigyCopilot getInteractionData=======> ', apiInteractionData);
        console.log('CognigyCopilot getInteractionData type=======> ', typeof apiInteractionData);

        let ENGAGEMENT_PARAMETERS = apiInteractionData?.intrinsics?.ENGAGEMENT_PARAMETERS;

        console.log('ENGAGEMENT_PARAMETERS --->', ENGAGEMENT_PARAMETERS);

        if (ENGAGEMENT_PARAMETERS) {
            let engObj = JSON.parse(ENGAGEMENT_PARAMETERS);
            let urlToken = engObj?.urlToken;
            let userId = engObj?.userId;
            let sessionId = engObj?.sessionId;
            let copilot = engObj?.copilot;
            console.log('Engagement object==> ', engObj);

            console.log('Engagement engObj?.urlToken==> ', urlToken);
            console.log('Engagement engObj?.userId==> ', userId);
            console.log('Engagement engObj?.sessionId==> ', sessionId);
            console.log('Engagement engObj?.copilot==> ', copilot);
            console.log('Engagement engObj?.copilot type ==> ', typeof copilot);

            setCopilotUrl(copilot);
        }
    }, [apiInteractionData]);

    return (
        <div
            style={{
                background: '#ccc',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
            }}
        >
            {copilotUrl && (
                <iframe
                    className={'screen'}
                    title='Agent Session'
                    frameBorder={0}
                    unsafe-url='true'
                    width={'100%'}
                    height={'100%'}
                    // src={`https://agent-assist-trial.cognigy.ai/?${sessionId}=sessionId&userId=${userId}&URLToken=${urlToken}&organisationId=5f5a27a74b39915e7f9acd21&projectId=65a54ec0567cde408a1bc296&configId=65b264c83e5bbeb0d74a8414`}
                    src={copilotUrl}
                />
            )}
        </div>
    );
};

export default CognigyCopilotIframe;
