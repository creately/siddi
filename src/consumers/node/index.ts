import { Consumer } from "../../siddi";
import { Matomo } from "./clients/matomo";

let matomoTracker: Matomo;

export const Consumers: Record<string, Consumer> = {
    matomo: {
        init: () => {
            matomoTracker = new Matomo({
                MATOMO_SITE_ID: process.env.MATOMO_SITE_ID,
                MATOMO_SITE_URL: process.env.MATOMO_SITE_URL,
                MATOMO_SOURCE_URL: process.env.MATOMO_SOURCE_URL
            })
        },
        test: () => true,
        identify: (userId: string, userProperties: object) => {
            matomoTracker.identify(userId, userProperties);
        },
        track: (eventName: string, eventProperties: object) => {
            matomoTracker.sendEvent(eventName, eventProperties);
        }
    }
}