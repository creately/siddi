import { Consumer } from '../siddi';
import { prepareMatomoDimensions } from '../utils';
declare global {
  interface Window {
    siddi: any;
    mixpanel: any;
    heap: any;
    amplitude: any;
    outbound: any;
    ga: any;
    snowplow: any;
    snowplowschema?: string; //Variable which holds the schema path
    sendinblue: any;
    gtag: any;
    Indicative: any;
    HyperDX: any;
    Piwik: any;
  }
}

/* Browser-based consumers implementation */
export const Consumers: Record<string, Consumer> = {
  mixpanel: {
    test: () => window.mixpanel && window.mixpanel.__loaded,
    identify: (userId: string, userProperties: any) => {
      window.mixpanel.identify(userId);
      if (userProperties) {
        window.mixpanel.people.set(userProperties);
      }
    },
    track: (eventName: string, eventProperties: any) => {
      window.mixpanel.track(eventName, eventProperties);
    },
  },
  heap: {
    test: () => window.heap && window.heap.track,
    identify: (userId: string, userProperties: any) => {
      window.heap.identify(userId);
      if (userProperties) {
        window.heap.addUserProperties(userProperties);
      }
    },
    track: (eventName: string, eventProperties: any) => {
      window.heap.track(eventName, eventProperties);
    },
  },
  amplitude: {
    test: () => window.amplitude && window.amplitude.options,
    identify: (userId: string, userProperties: any) => {
      window.amplitude.getInstance().setUserId(userId);
      if (userProperties) {
        window.amplitude.getInstance().setUserProperties(userProperties);
      }
    },
    track: (eventName: string, eventProperties: any) => {
      window.amplitude.getInstance().logEvent(eventName, eventProperties);
    },
  },
  outbound: {
    // This is Zendesk Connect
    test: () => window.outbound && window.outbound.track,
    identify: (userId: string, userProperties: any) => {
      window.outbound.identify(userId, userProperties);
    },
    track: (eventName: string, eventProperties: any) => {
      window.outbound.track(eventName, eventProperties);
    },
  },
  googleAnalytics: {
    test: () => !!window.ga,
    identify: (userId: string, userProperties: any = {}) => {
      userProperties.userId = userId;
      window.ga('set', userProperties);
    },
    track: (eventName: string, eventProperties: any = {}) => {
      eventProperties.eventCategory = eventProperties.eventCategory ? eventProperties.eventCategory : 'All';
      eventProperties.eventAction = eventName;
      eventProperties.hitType = 'event';
      window.ga('send', eventProperties);
    },
  },
  snowplow: {
    // TODO: Improvements to use multiple schemas
    test: () => !!window.snowplow && !!window.snowplowschema,
    identify: (userId: string, _: any = {}) => {
      window.snowplow('setUserId', userId);
    },
    track: (eventName: string, eventProperties: any = {}) => {
      eventProperties.event = eventName;
      const selfDescribingEvent = {
        schema: window.snowplowschema,
        data: eventProperties,
      };
      window.snowplow('trackSelfDescribingEvent', selfDescribingEvent);
    },
  },
  sendinblue: {
    test: () => window.sendinblue,
    identify: (userId: string, userProperties: any) => {
      window.sendinblue.identify(userId, userProperties);
    },
    track: (eventName: string, eventProperties: any) => {
      window.sendinblue.track(eventName, eventProperties);
    },
  },
  ga4: {
    test: () => !!window.gtag,
    identify: (userId: string, userProperties: any = {}) => {
      userProperties.user_id = userId;
      window.gtag('set', 'user_properties', userProperties);
    },
    track: (eventName: string, eventProperties: any) => {
      window.gtag('event', eventName.replace(/[.\-\s]+/g, '_'), eventProperties);
    },
  },
  indicative: {
    test: () => window.Indicative,
    identify: (userId: string, _: any = {}) => {
      window.Indicative.setUniqueID(userId, true);
    },
    track: (eventName: string, eventProperties: any) => {
      window.Indicative.buildEvent(eventName, eventProperties);
    },
  },
  hyperdx: {
    test: () => window.HyperDX,
    identify: (userId: string, _: any = {}) => {
      window.HyperDX.setGlobalAttributes({
        userId: userId,
      });
    },
    track: (eventName: string, eventProperties: any) => {
      window.HyperDX.addAction(eventName, eventProperties);
    },
  },
  matomo: {
    test: () => !!window.Piwik,
    identify: (userId: string, _: any = {}) => {
      window.Piwik.getAsyncTracker().setUserId(userId);
    },
    track: (eventName: string, eventProperties: any) => {
      window.Piwik.getAsyncTracker().trackEvent(
        eventProperties.eventCategory,
        eventName,
        eventName,
        1,
        prepareMatomoDimensions(eventProperties)
      );
    },
  },
};
