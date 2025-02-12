import { LOG_MSG } from '../../../utils';
const MatomoTracker = require('matomo-tracker');

export class Matomo {
    private trackingClient: any;
    private _userId: string = '';
    private _payload: object = {
        ua: "Create:Siddi"
    };

    constructor(private config: any) {
        this.trackingClient = new MatomoTracker(this.config.MATOMO_SITE_ID, this.config.MATOMO_SITE_URL, true);
        this.trackingClient.on('error', (err: any) => {
            LOG_MSG("Error in Tracking Event", "MatomoTracker");
            LOG_MSG(JSON.stringify(err, null, 2), "MatomoTracker");
        });
    }

    identify(userId: string, userProperties?: object) {
        this._payload = { ...this._payload, uid: userId, ...userProperties };
        this._userId = userId;
    }

    async sendEvent(eventName: string, eventProperties?: any, userId?: string) {
        const data = {
            action_name: eventName,
            uid: this._userId || userId,
            url: this.config.MATOMO_SOURCE_URL || ('https://chargebee.creately.com/?event=' + eventName),
            e_a: eventProperties.eventType || 'unknown',
            e_c: "Chargebee",
            e_n: eventName
        };

        this.trackingClient.track({ ...this._payload, ...data });
    }
}
