import AmplitudeClient from "amplitude";
import { LOG_MSG } from "../../../utils";

export class Amplitude {
    private trackingClient: AmplitudeClient;
    private _userId: string = '';
    private _userProperties: Record<any, any> = {};

    constructor(private config: any) {
        this.trackingClient = new AmplitudeClient(this.config.AMPLITUDE_API_KEY, {
            tokenEndpoint: this.config.AMPLITUDE_TOKEN_ENDPOINT
        });
    }

    identify(userId: string, userProperties: any) {
        this.trackingClient.identify({ user_id: userId });
        this._userId = userId;
        this._userProperties = userProperties;
    }

    async sendEvent(
        eventType: string,
        eventProperties?: any,
        userId?: string,
        userProperties?: any
    ) {
        let newUserProperties: any = {};
        if (userProperties) {
            newUserProperties = userProperties;
        }
        newUserProperties.region = this.config.REGION;

        const trackingData = {
            event_type: eventType,
            user_id: this._userId || userId,
            event_properties: eventProperties,
            user_properties: { ...this._userProperties, ...newUserProperties },
        };

        return this.trackingClient
            .track(trackingData)
            .then((res: any) => res)
            .catch((err: any) => {
                LOG_MSG("Error in Tracking Event", "AplitudeTracker");
                LOG_MSG(JSON.stringify(err, null, 2), "AplitudeTracker");
            });
    }
}
