import React, { useEffect, useState } from 'react';
import { useWidgetApi } from '../../contexts/WidgetApiContext';

import axios from 'axios';

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

        const interactionChannel = apiInteractionData?.channel;

        // if (interactionChannel === 'VOICE') {
        //     let intId = apiInteractionData?.originatingAddress;
        //     let data = JSON.stringify({
        //         dataSource: 'mongodb-atlas',
        //         database: 'avayaocf-qnamaker',
        //         collection: 'cognigy-copilot',
        //         filter: {
        //             _id: intId,
        //         },
        //     });

        //     let config = {
        //         method: 'post',
        //         maxBodyLength: Infinity,
        //         url: 'https://data.mongodb-api.com/app/avayaocf-vrral/endpoint/data/v1/action/find',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         data: data,
        //     };

        //     axios
        //         .request(config)
        //         .then((response) => {
        //             console.log(JSON.stringify(response.data));
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         });
        // } else {
        //     let ENGAGEMENT_PARAMETERS = apiInteractionData?.intrinsics?.ENGAGEMENT_PARAMETERS;

        //     console.log('ENGAGEMENT_PARAMETERS --->', ENGAGEMENT_PARAMETERS);

        //     if (ENGAGEMENT_PARAMETERS) {
        //         let engObj = JSON.parse(ENGAGEMENT_PARAMETERS);
        //         let urlToken = engObj?.urlToken;
        //         let userId = engObj?.userId;
        //         let sessionId = engObj?.sessionId;
        //         let copilot = engObj?.copilot;
        //         console.log('Engagement object==> ', engObj);

        //         console.log('Engagement engObj?.urlToken==> ', urlToken);
        //         console.log('Engagement engObj?.userId==> ', userId);
        //         console.log('Engagement engObj?.sessionId==> ', sessionId);
        //         console.log('Engagement engObj?.copilot==> ', copilot);
        //         console.log('Engagement engObj?.copilot type ==> ', typeof copilot);

        //         setCopilotUrl(copilot);
        //     }
        // }

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
        } else {
            let intId = apiInteractionData?.originatingAddress;
            let data = JSON.stringify({
                dataSource: 'mongodb-atlas',
                database: 'avayaocf-qnamaker',
                collection: 'cognigy-copilot',
                filter: {
                    _id: intId,
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
                    // console.log(JSON.stringify(response.data));
                    console.log('Copilot api response==> ', response.data);
                    let copilotUrl = response.data.documents[0].copilot;
                    console.log('Copilot url through api==> ', copilotUrl);
                    setCopilotUrl(copilotUrl);
                })
                .catch((error) => {
                    console.log('Error fetching copilot url from api==> ', error);
                });
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
