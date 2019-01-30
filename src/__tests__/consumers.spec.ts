import { Consumers } from '../consumers';

describe('Consumers', () => {
  const mixpanel = {
    __loaded: true,
    identify: () => {},
    track: () => {},
    people: {
        set: () => {},
    }
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
  });
});
