import { BrowserConsumers } from '../siddi';

describe('Consumers', () => {
  const mixpanel = {
    __loaded: true,
    identify: () => {},
    track: () => {},
    people: {
      set: () => {},
    },
  };

  const heap = {
    track: () => {},
    identify: () => {},
    addUserProperties: () => {},
  };

  const amplitudeInstance = {
    setUserId: () => {},
    setUserProperties: () => {},
    logEvent: () => {},
  };

  const amplitude = {
    options: {},
    getInstance: () => amplitudeInstance,
  };

  const outbound = {
    identify: () => {},
    track: () => {},
  };

  const snowplow = () => {};

  const ga = () => {};

  const sendinblue = {
    test: () => {},
    track: () => {},
    identify: () => {},
  };

  const ga4 = {
    test: () => {},
    track: () => {},
    identify: () => {},
  };

  const indicative = {
    setUniqueID: () => {},
    buildEvent: () => {},
  };

  const HyperDX = {
    setGlobalAttributes: () => {},
    addAction: () => {},
  };

  describe('mixpanel', () => {
    beforeEach(() => {
      window.mixpanel = mixpanel;
    });
    describe('test', () => {
      it('should return true if loaded', () => {
        expect(BrowserConsumers.mixpanel.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.mixpanel;
        expect(BrowserConsumers.mixpanel.test()).toBeFalsy();
      });
      it('should return false if not initialized', () => {
        delete window.mixpanel.__loaded;
        expect(BrowserConsumers.mixpanel.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(mixpanel, 'identify');
        jest.spyOn(mixpanel.people, 'set');
      });
      it('should register the given user', () => {
        BrowserConsumers.mixpanel.identify('mock-user-id', {});
        expect(mixpanel.identify).toBeCalledWith('mock-user-id');
      });
      it('should set user properties if given', () => {
        BrowserConsumers.mixpanel.identify('mock-user-id', { paid: 'no' });
        expect(mixpanel.identify).toBeCalledWith('mock-user-id');
        expect(mixpanel.people.set).toBeCalledWith({ paid: 'no' });
      });
    });
    describe('track', () => {
      beforeEach(() => {
        jest.spyOn(mixpanel, 'track');
      });
      it('should send given tracking data', () => {
        BrowserConsumers.mixpanel.track('event.name', { prop: 'a prop' });
        expect(mixpanel.track).toBeCalledWith('event.name', { prop: 'a prop' });
      });
    });
  });
  describe('heap', () => {
    beforeEach(() => {
      window.heap = heap;
    });
    describe('test', () => {
      it('should return true if loaded', () => {
        expect(BrowserConsumers.heap.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.heap;
        expect(BrowserConsumers.heap.test()).toBeFalsy();
      });
      it('should return false if not initialized', () => {
        delete window.heap.track;
        expect(BrowserConsumers.heap.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(heap, 'identify');
        jest.spyOn(heap, 'addUserProperties');
      });
      it('should register the given user', () => {
        BrowserConsumers.heap.identify('mock-user-id', {});
        expect(heap.identify).toBeCalledWith('mock-user-id');
      });
      it('should set user properties if given', () => {
        BrowserConsumers.heap.identify('mock-user-id', { paid: 'no' });
        expect(heap.identify).toBeCalledWith('mock-user-id');
        expect(heap.addUserProperties).toBeCalledWith({ paid: 'no' });
      });
    });
    describe('track', () => {
      beforeEach(() => {
        heap.track = () => {};
        jest.spyOn(heap, 'track');
      });
      it('should send given tracking data', () => {
        BrowserConsumers.heap.track('event.name', { prop: 'a prop' });
        expect(heap.track).toBeCalledWith('event.name', { prop: 'a prop' });
      });
    });
  });
  describe('amplitude', () => {
    beforeEach(() => {
      window.amplitude = amplitude;
    });
    describe('test', () => {
      it('should return true if loaded', () => {
        expect(BrowserConsumers.amplitude.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.amplitude;
        expect(BrowserConsumers.amplitude.test()).toBeFalsy();
      });
      it('should return false if not initialized', () => {
        delete window.amplitude.options;
        expect(BrowserConsumers.amplitude.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(amplitudeInstance, 'setUserId');
        jest.spyOn(amplitudeInstance, 'setUserProperties');
      });
      it('should register the given user', () => {
        BrowserConsumers.amplitude.identify('mock-user-id', {});
        expect(amplitudeInstance.setUserId).toBeCalledWith('mock-user-id');
      });
      it('should set user properties if given', () => {
        BrowserConsumers.amplitude.identify('mock-user-id', { paid: 'no' });
        expect(amplitudeInstance.setUserId).toBeCalledWith('mock-user-id');
        expect(amplitudeInstance.setUserProperties).toBeCalledWith({ paid: 'no' });
      });
    });
    describe('track', () => {
      beforeEach(() => {
        jest.spyOn(amplitudeInstance, 'logEvent');
      });
      it('should send given tracking data', () => {
        BrowserConsumers.amplitude.track('event.name', { prop: 'a prop' });
        expect(amplitudeInstance.logEvent).toBeCalledWith('event.name', { prop: 'a prop' });
      });
    });
  });
  describe('snowplow', () => {
    beforeEach(() => {
      window.snowplow = snowplow;
      window.snowplowschema = 'iglu://schema.create.ly';
    });
    describe('test', () => {
      it('should return true if loaded', () => {
        expect(BrowserConsumers.snowplow.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.snowplow;
        expect(BrowserConsumers.snowplow.test()).toBeFalsy();
      });
      it('should return false if schema is not set', () => {
        delete window.snowplowschema;
        expect(BrowserConsumers.snowplow.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(window, 'snowplow');
      });
      it('should call setUserId event', () => {
        BrowserConsumers.snowplow.identify('vetorRajaId', {});
        expect(window.snowplow).toHaveBeenCalledWith('setUserId', 'vetorRajaId');
      });
      it('should call setUserId event with additional parameter', () => {
        BrowserConsumers.snowplow.identify('vetorRajaId', { loc: 'dd' });
        expect(window.snowplow).toHaveBeenCalledWith('setUserId', 'vetorRajaId');
      });
    });
    describe('track', () => {
      beforeEach(() => {
        jest.spyOn(window, 'snowplow');
      });
      it('should send given tracking data', () => {
        BrowserConsumers.snowplow.track('event.name', { prop: 'a prop' });
        expect(window.snowplow).toBeCalledWith('trackSelfDescribingEvent', {
          schema: 'iglu://schema.create.ly',
          data: {
            prop: 'a prop',
            event: 'event.name',
          },
        });
      });
      it('should send given tracking data without additional parameter', () => {
        BrowserConsumers.snowplow.track('event.name', {});
        expect(window.snowplow).toBeCalledWith('trackSelfDescribingEvent', {
          schema: 'iglu://schema.create.ly',
          data: {
            event: 'event.name',
          },
        });
      });
    });
  });
  describe('zendesk-connect', () => {
    beforeEach(() => {
      window.outbound = outbound;
    });
    describe('test', () => {
      it('should return true if loaded', () => {
        expect(BrowserConsumers.outbound.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.outbound;
        expect(BrowserConsumers.outbound.test()).toBeFalsy();
      });
      it('should return false if not initialized', () => {
        delete window.outbound.track;
        expect(BrowserConsumers.outbound.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(outbound, 'identify');
      });
      it('should register the given user', () => {
        BrowserConsumers.outbound.identify('mock-user-id', {});
        expect(outbound.identify).toBeCalledWith('mock-user-id', {});
      });
      it('should register the given user with properties', () => {
        BrowserConsumers.outbound.identify('mock-user-id', { emotion: 'lol' });
        expect(outbound.identify).toBeCalledWith('mock-user-id', { emotion: 'lol' });
      });
    });
    describe('track', () => {
      beforeEach(() => {
        outbound.track = () => {};
        jest.spyOn(outbound, 'track');
      });
      it('should send given tracking data', () => {
        BrowserConsumers.outbound.track('event.name', { prop: 'a prop' });
        expect(outbound.track).toBeCalledWith('event.name', { prop: 'a prop' });
      });
    });
    describe('googleAnalytics', () => {
      describe('test', () => {
        it('should return false if ga is not loaded', () => {
          expect(BrowserConsumers.googleAnalytics.test()).toBeFalsy();
        });
        it('should true if ga is loaded', () => {
          window.ga = ga;
          expect(BrowserConsumers.googleAnalytics.test()).toBeTruthy();
        });
      });
      describe('identify', () => {
        beforeEach(() => {
          window.ga = ga;
          jest.spyOn(window, 'ga');
        });
        it('should register given user', () => {
          BrowserConsumers.googleAnalytics.identify('user-id', {});
          expect(window.ga).toHaveBeenCalledWith('set', { userId: 'user-id' });
        });
        it('should not modify any user properties', () => {
          BrowserConsumers.googleAnalytics.identify('user-id', { plan: 'trial' });
          expect(window.ga).toHaveBeenCalledWith('set', { userId: 'user-id', plan: 'trial' });
        });
      });
      describe('track', () => {
        beforeEach(() => {
          window.ga = ga;
          jest.spyOn(window, 'ga');
        });
        it('should use All as the event category if not provided in the event properties', () => {
          BrowserConsumers.googleAnalytics.track('dog.bark', {});
          expect(window.ga).toHaveBeenCalledWith('send', {
            eventCategory: 'All',
            eventAction: 'dog.bark',
            hitType: 'event',
          });
        });
        it('should use the given event category on the given event properties', () => {
          BrowserConsumers.googleAnalytics.track('cat.run', { speed: 'light', eventCategory: 'war' });
          expect(window.ga).toHaveBeenCalledWith('send', {
            eventCategory: 'war',
            eventAction: 'cat.run',
            hitType: 'event',
            speed: 'light',
          });
        });
      });
    });
    describe('sendinblue', () => {
      beforeEach(() => {
        window.sendinblue = sendinblue;
      });
      describe('test', () => {
        it('should return true if loaded', () => {
          expect(BrowserConsumers.sendinblue.test()).toBeTruthy();
        });
        it('should return false if not loaded', () => {
          delete window.sendinblue;
          expect(BrowserConsumers.sendinblue.test()).toBeFalsy();
        });
      });
      describe('identify', () => {
        beforeEach(() => {
          jest.spyOn(sendinblue, 'identify');
        });
        it('should register the given user', () => {
          BrowserConsumers.sendinblue.identify('mock-user-id', {});
          expect(sendinblue.identify).toBeCalledWith('mock-user-id', {});
        });
        it('should register the given user with properties', () => {
          BrowserConsumers.sendinblue.identify('mock-user-id', { userProperty: 'user property' });
          expect(sendinblue.identify).toBeCalledWith('mock-user-id', { userProperty: 'user property' });
        });
      });
      describe('track', () => {
        beforeEach(() => {
          jest.spyOn(sendinblue, 'track');
        });
        it('should send given tracking data', () => {
          BrowserConsumers.sendinblue.track('event.name', { prop: 'a prop' });
          expect(sendinblue.track).toBeCalledWith('event.name', { prop: 'a prop' });
        });
      });
    });
    describe('ga4', () => {
      describe('test', () => {
        it('should return false if ga4 is not loaded', () => {
          expect(BrowserConsumers.ga4.test()).toBeFalsy();
        });
        it('should true if ga4 is loaded', () => {
          window.gtag = ga4;
          expect(BrowserConsumers.ga4.test()).toBeTruthy();
        });
      });
      describe('identify', () => {
        beforeEach(() => {
          window.gtag = () => {};
          jest.spyOn(window, 'gtag');
        });
        it('should register given user', () => {
          BrowserConsumers.ga4.identify('user-id', {});
          expect(window.gtag).toHaveBeenCalledWith('set', 'user_properties', { user_id: 'user-id' });
        });
        it('should not modify any user properties', () => {
          BrowserConsumers.ga4.identify('user-id', { plan: 'trial' });
          expect(window.gtag).toHaveBeenCalledWith('set', 'user_properties', { user_id: 'user-id', plan: 'trial' });
        });
      });
      describe('track', () => {
        beforeEach(() => {
          window.gtag = () => {};
          jest.spyOn(window, 'gtag');
        });
        it('should send given tracking data', () => {
          BrowserConsumers.ga4.track('event name..with_dots.spaces  and-hyphens', { prop: 'a prop' });
          expect(window.gtag).toHaveBeenCalledWith('event', 'event_name_with_dots_spaces_and_hyphens', {
            prop: 'a prop',
          });
        });
      });
    });
    describe('indicative', () => {
      describe('test', () => {
        it('should return false if indicative is not loaded', () => {
          expect(BrowserConsumers.indicative.test()).toBeFalsy();
        });
        it('should true if indicative is loaded', () => {
          window.Indicative = indicative;
          expect(BrowserConsumers.indicative.test()).toBeTruthy();
        });
      });
      describe('identify', () => {
        beforeEach(() => {
          window.Indicative = indicative;
          jest.spyOn(indicative, 'setUniqueID');
        });
        it('should register given user', () => {
          BrowserConsumers.indicative.identify('user-id', {});
          expect(indicative.setUniqueID).toHaveBeenCalledWith('user-id', true);
        });
        it('should not modify any user properties', () => {
          BrowserConsumers.indicative.identify('user-id', { plan: 'trial' });
          expect(window.Indicative.setUniqueID).toHaveBeenCalledWith('user-id', true);
        });
      });
      describe('track', () => {
        beforeEach(() => {
          window.Indicative = indicative;
          jest.spyOn(indicative, 'buildEvent');
        });
        it('should send given tracking data', () => {
          BrowserConsumers.indicative.track('event.name', { prop: 'a prop' });
          expect(window.Indicative.buildEvent).toHaveBeenCalledWith('event.name', { prop: 'a prop' });
        });
      });
    });
    describe('HyperDX', () => {
      describe('test', () => {
        it('should return false if HyperDX is not loaded', () => {
          expect(BrowserConsumers.hyperdx.test()).toBeFalsy();
        });
        it('should true if HyperDX is loaded', () => {
          window.HyperDX = HyperDX;
          expect(BrowserConsumers.hyperdx.test()).toBeTruthy();
        });
      });
      describe('identify', () => {
        beforeEach(() => {
          window.HyperDX = HyperDX;
          jest.spyOn(HyperDX, 'setGlobalAttributes');
        });
        it('should register given user', () => {
          BrowserConsumers.hyperdx.identify('user-id', {});
          expect(HyperDX.setGlobalAttributes).toHaveBeenCalledWith({ userId: 'user-id' });
        });
        it('should not modify any user properties', () => {
          BrowserConsumers.hyperdx.identify('user-id', { plan: 'trial' });
          expect(window.HyperDX.setGlobalAttributes).toHaveBeenCalledWith({ userId: 'user-id' });
        });
      });
      describe('track', () => {
        beforeEach(() => {
          window.HyperDX = HyperDX;
          jest.spyOn(HyperDX, 'addAction');
        });
        it('should send given tracking data', () => {
          BrowserConsumers.hyperdx.track('event.name', { prop: 'a prop' });
          expect(window.HyperDX.addAction).toHaveBeenCalledWith('event.name', { prop: 'a prop' });
        });
      });
    });
  });
});
