import { Consumers } from '../consumers';

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
  describe('mixpanel', () => {
    beforeEach(() => {
      window.mixpanel = mixpanel;
    });
    describe('test', () => {
      it('should return true if loaded', () => {
        expect(Consumers.mixpanel.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.mixpanel;
        expect(Consumers.mixpanel.test()).toBeFalsy();
      });
      it('should return false if not initialized', () => {
        delete window.mixpanel.__loaded;
        expect(Consumers.mixpanel.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(mixpanel, 'identify');
        jest.spyOn(mixpanel.people, 'set');
      });
      it('should register the given user', () => {
        Consumers.mixpanel.identify('mock-user-id');
        expect(mixpanel.identify).toBeCalledWith('mock-user-id');
      });
      it('should set user properties if given', () => {
        Consumers.mixpanel.identify('mock-user-id', { paid: 'no' });
        expect(mixpanel.identify).toBeCalledWith('mock-user-id');
        expect(mixpanel.people.set).toBeCalledWith({ paid: 'no' });
      });
    });
    describe('track', () => {
      beforeEach(() => {
        jest.spyOn(mixpanel, 'track');
      });
      it('should send given tracking data', () => {
        Consumers.mixpanel.track('event.name', { prop: 'a prop' });
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
        expect(Consumers.heap.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.heap;
        expect(Consumers.heap.test()).toBeFalsy();
      });
      it('should return false if not initialized', () => {
        delete window.heap.track;
        expect(Consumers.heap.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(heap, 'identify');
        jest.spyOn(heap, 'addUserProperties');
      });
      it('should register the given user', () => {
        Consumers.heap.identify('mock-user-id');
        expect(heap.identify).toBeCalledWith('mock-user-id');
      });
      it('should set user properties if given', () => {
        Consumers.heap.identify('mock-user-id', { paid: 'no' });
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
        Consumers.heap.track('event.name', { prop: 'a prop' });
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
        expect(Consumers.amplitude.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.amplitude;
        expect(Consumers.amplitude.test()).toBeFalsy();
      });
      it('should return false if not initialized', () => {
        delete window.amplitude.options;
        expect(Consumers.amplitude.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(amplitudeInstance, 'setUserId');
        jest.spyOn(amplitudeInstance, 'setUserProperties');
      });
      it('should register the given user', () => {
        Consumers.amplitude.identify('mock-user-id');
        expect(amplitudeInstance.setUserId).toBeCalledWith('mock-user-id');
      });
      it('should set user properties if given', () => {
        Consumers.amplitude.identify('mock-user-id', { paid: 'no' });
        expect(amplitudeInstance.setUserId).toBeCalledWith('mock-user-id');
        expect(amplitudeInstance.setUserProperties).toBeCalledWith({ paid: 'no' });
      });
    });
    describe('track', () => {
      beforeEach(() => {
        jest.spyOn(amplitudeInstance, 'logEvent');
      });
      it('should send given tracking data', () => {
        Consumers.amplitude.track('event.name', { prop: 'a prop' });
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
        expect(Consumers.snowplow.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.snowplow;
        expect(Consumers.snowplow.test()).toBeFalsy();
      });
      it('should return false if schema is not set', () => {
        delete window.snowplowschema;
        expect(Consumers.snowplow.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(window, 'snowplow');
      });
      it('should call setUserId event', () => {
        Consumers.snowplow.identify('vetorRajaId');
        expect(window.snowplow).toHaveBeenCalledWith('setUserId', 'vetorRajaId');
      });
      it('should call setUserId event with additional parameter', () => {
        Consumers.snowplow.identify('vetorRajaId', { loc: 'dd' });
        expect(window.snowplow).toHaveBeenCalledWith('setUserId', 'vetorRajaId');
      });
    });
    describe('track', () => {
      beforeEach(() => {
        jest.spyOn(window, 'snowplow');
      });
      it('should send given tracking data', () => {
        Consumers.snowplow.track('event.name', { prop: 'a prop' });
        expect(window.snowplow).toBeCalledWith('trackSelfDescribingEvent', {
          schema: 'iglu://schema.create.ly',
          data: {
            prop: 'a prop',
            event: 'event.name',
          },
        });
      });
      it('should send given tracking data without additional parameter', () => {
        Consumers.snowplow.track('event.name');
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
        expect(Consumers.outbound.test()).toBeTruthy();
      });
      it('should return false if not loaded', () => {
        delete window.outbound;
        expect(Consumers.outbound.test()).toBeFalsy();
      });
      it('should return false if not initialized', () => {
        delete window.outbound.track;
        expect(Consumers.outbound.test()).toBeFalsy();
      });
    });
    describe('identify', () => {
      beforeEach(() => {
        jest.spyOn(outbound, 'identify');
      });
      it('should register the given user', () => {
        Consumers.outbound.identify('mock-user-id', { emotion: 'lol' });
        expect(outbound.identify).toBeCalledWith('mock-user-id', { emotion: 'lol' });
      });
    });
    describe('track', () => {
      beforeEach(() => {
        outbound.track = () => {};
        jest.spyOn(outbound, 'track');
      });
      it('should send given tracking data', () => {
        Consumers.outbound.track('event.name', { prop: 'a prop' });
        expect(outbound.track).toBeCalledWith('event.name', { prop: 'a prop' });
      });
    });
    describe('googleAnalytics', () => {
      describe('test', () => {
        it('should return false if ga is not loaded', () => {
          expect(Consumers.googleAnalytics.test()).toBeFalsy();
        });
        it('should true if ga is loaded', () => {
          window.ga = ga;
          expect(Consumers.googleAnalytics.test()).toBeTruthy();
        });
      });
      describe('identify', () => {
        beforeEach(() => {
          window.ga = ga;
          spyOn(window, 'ga');
        });
        it('should register given user', () => {
          Consumers.googleAnalytics.identify('user-id');
          expect(window.ga).toHaveBeenCalledWith('set', { userId: 'user-id' });
        });
        it('should not modify any user properties', () => {
          Consumers.googleAnalytics.identify('user-id', { plan: 'trial' });
          expect(window.ga).toHaveBeenCalledWith('set', { userId: 'user-id', plan: 'trial' });
        });
      });
      describe('track', () => {
        beforeEach(() => {
          window.ga = ga;
          spyOn(window, 'ga');
        });
        it('should use All as the event category if not provided in the event properties', () => {
          Consumers.googleAnalytics.track('dog.bark');
          expect(window.ga).toHaveBeenCalledWith('send', {
            eventCategory: 'All',
            eventAction: 'dog.bark',
            hitType: 'event',
          });
        });
        it('should use the given event category on the given event properties', () => {
          Consumers.googleAnalytics.track('cat.run', { speed: 'light', eventCategory: 'war' });
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
          expect(Consumers.sendinblue.test()).toBeTruthy();
        });
        it('should return false if not loaded', () => {
          delete window.sendinblue;
          expect(Consumers.sendinblue.test()).toBeFalsy();
        });
      });
      describe('identify', () => {
        beforeEach(() => {
          jest.spyOn(sendinblue, 'identify');
        });
        it('should register the given user', () => {
          Consumers.sendinblue.identify('mock-user-id', { userProperty: 'user property' });
          expect(sendinblue.identify).toBeCalledWith('mock-user-id', { userProperty: 'user property' });
        });
      });
      describe('track', () => {
        beforeEach(() => {
          jest.spyOn(sendinblue, 'track');
        });
        it('should send given tracking data', () => {
          Consumers.sendinblue.track('event.name', { prop: 'a prop' });
          expect(sendinblue.track).toBeCalledWith('event.name', { prop: 'a prop' });
        });
      });
    });
  });
});
