import { Consumer } from "../../siddi";
import { Amplitude } from "./clients/amplitude";
import { Matomo } from "./clients/matomo";

let amplitudeTracker : Amplitude;
let matomoTracker: Matomo;

export const Consumers: Record<string, Consumer> = {
    amplitude: {
        init: () => {
            amplitudeTracker = new Amplitude({
                AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
                AMPLITUDE_TOKEN_ENDPOINT: process.env.AMPLITUDE_TOKEN_ENDPOINT as string || "https://api2.amplitude.com"
            });
        },
        test: () => true,
        identify: (userId: string, userProperties: object) => {
            amplitudeTracker.identify(userId, userProperties);
        },
        track: (eventName: string, eventProperties: object) => {
            amplitudeTracker.sendEvent(eventName, eventProperties)
        }
    },
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