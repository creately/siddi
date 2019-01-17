export type ConsumerConfig = {
  name: string;
  test: Function;
  identify: Function;
  track: Function;
};

declare global {
  interface Window {
    mixpanel: any;
    heap: any;
    amplitude: any;
    outbound: any;
  }
}

export const Consumers: ConsumerConfig[] = [
  {
    name: 'mixpanel',
    test: () => window.mixpanel && window.mixpanel.__loaded,
    identify: (userId: string, userProperties: any) => {
      window.mixpanel.identify(userId);
      if (userProperties) {
        window.mixpanel.set(userProperties);
      }
    },
    track: (eventName: string, eventProperties: any) => {
      window.mixpanel.track(eventName, eventProperties);
    },
  },
  {
    name: 'heap',
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
  {
    name: 'amplitude',
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
  {
    name: 'zendesk-connect',
    test: () => window.outbound && window.outbound.identify && window.outbound.track,
    identify: (userId: string, userProperties: any) => {
      window.outbound.identify(userId, userProperties);
    },
    track: (eventName: string, eventProperties: any) => {
      window.outbound.track(eventName, eventProperties);
    },
  },
];
