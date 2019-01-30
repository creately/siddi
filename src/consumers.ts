/**
 * Siddi event consumer configuration object
 * test: Function which returnes a boolean based on consumer is initialized and active
 * track: Tracking function implementation based on consumer API
 * identify: User identification function implementation based on consumer API
 */
export type ConsumerConfiguration = {
  [name: string]: {
    test: Function;
    identify: Function;
    track: Function;
  };
};

/**
 * We need this shit, typescript blah!
 */
declare global {
  interface Window {
    siddi: any;
    mixpanel: any;
    heap: any;
    amplitude: any;
    outbound: any;
  }
}

/**
 * All consumer implementations
 */
export const Consumers: ConsumerConfiguration = {
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
};
