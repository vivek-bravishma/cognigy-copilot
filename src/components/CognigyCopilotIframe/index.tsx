import React, { useEffect, useRef, useState } from 'react';
import { useWidgetApi } from '../../contexts/WidgetApiContext';

import axios from 'axios';

const CognigyCopilotIframe = () => {
    const [copilotUrl, setCopilotUrl] = useState('https://shubham.lab.bravishma.com/child.html');
    const { widgetApi, interactionId, apiInteractionData } = useWidgetApi();
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

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

    // function handleMessage(event) {
    //     alert('Message from inner iframe: ' + event.data);
    //     console.log('Message from inner iframe: ', event.data);
    // } // Add event listener for message from inner iframeswindow.addEventListener("message", handleMessage, false);

    // (window as any).handleMessage = handleMessage;

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Ensure the message comes from a trusted origin
            if (event.origin !== 'https://shubham.lab.bravishma.com') return;

            if (event.data.type === 'EXECUTE_API') {
                const { functionName, functionWithPayload } = event.data;
                if (widgetApi && typeof widgetApi[functionName] === 'function') {
                    // let resp = widgetApi[functionWithPayload];
                    let resp = eval(`widgetApi.${functionWithPayload}`);
                    console.log('function resp from iframe===> ', resp);
                } else {
                    console.error('API function not found:', functionName);
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [widgetApi]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe && widgetApi) {
            const sendApiToIframe = () => {
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage(
                        {
                            type: 'SET_WIDGET_API',
                            api: widgetApi,
                            interactionId: interactionId,
                            apiInteractionData: apiInteractionData,
                        },
                        copilotUrl,
                    );
                    console.log('message posted from cognigy copilot to copilot iframe ');
                }
            };

            iframe.addEventListener('load', sendApiToIframe);

            return () => {
                iframe.removeEventListener('load', sendApiToIframe);
            };
        }
    }, [copilotUrl, widgetApi]);

    useEffect(() => {
        if (apiInteractionData !== null && apiInteractionData !== undefined) {
            // let interData = widgetApi?.getInteractionData();
            console.log('CognigyCopilot getInteractionData=======> ', apiInteractionData);
            console.log(
                'CognigyCopilot getInteractionData type=======> ',
                typeof apiInteractionData,
            );

            const interactionChannel = apiInteractionData?.channel;

            console.log('is interaction channel voice?==> ', interactionChannel === 'VOICE');

            if (interactionChannel === 'VOICE') {
                // let intId = apiInteractionData?.originatingAddress;
                let ENGAGEMENT_PARAMETERS = apiInteractionData?.intrinsics?.ENGAGEMENT_PARAMETERS;
                let engObj: any = null;
                let copilotUrlSessionId: any = null;

                if (!ENGAGEMENT_PARAMETERS) {
                    copilotUrlSessionId = apiInteractionData?.intrinsics?.CALLER_NUMBER;
                } else {
                    engObj = JSON.parse(ENGAGEMENT_PARAMETERS);
                    copilotUrlSessionId = engObj?.copiloturl_sessionid;
                }

                let data = JSON.stringify({
                    dataSource: 'mongodb-atlas',
                    database: 'avayaocf-qnamaker',
                    collection: 'cognigy-copilot',
                    filter: {
                        _id: copilotUrlSessionId,
                    },
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://data.mongodb-api.com/app/avayaocf-vrral/endpoint/data/v1/action/find',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: data,
                };

                axios
                    .request(config)
                    .then((response) => {
                        console.log('response from mongodb call from voice => ', response.data);
                        let copilotUrl = response.data.documents[0].copilot;
                        console.log('Copilot url through api==> ', copilotUrl);
                        // setCopilotUrl(copilotUrl);
                        setCopilotUrl('https://shubham.lab.bravishma.com/child.html');
                    })
                    .catch((error) => {
                        console.log('Error fetching copilot url for Voice from mongodb==> ', error);
                    });
            } else {
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

                    // setCopilotUrl(copilot);
                    setCopilotUrl('https://shubham.lab.bravishma.com/child.html');
                }
            }
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
                    ref={iframeRef}
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
