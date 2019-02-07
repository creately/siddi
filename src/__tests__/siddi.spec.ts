import { Siddi } from '../siddi';
import { Consumers } from '../consumers';

describe('Siddi', () => {
  let siddi: Siddi;
  const mixpanel = {
    __loaded: true,
    identify: () => {},
    track: () => {},
    people: {
      set: () => {},
    },
  };

  const heap = {
    track: false,
    identify: () => {},
  };

  window.mixpanel = mixpanel;
  window.heap = heap;

  let mixpanelTestSpy: jest.SpyInstance;
  let mixpanelTrackSpy: jest.SpyInstance;
  let mixpanelIdentifySpy: jest.SpyInstance;
  let heapIdentifySpy: jest.SpyInstance;
  beforeEach(() => {
    mixpanelTestSpy = jest.spyOn(Consumers['mixpanel'], 'test');
    mixpanelTrackSpy = jest.spyOn(mixpanel, 'track');
    mixpanelIdentifySpy = jest.spyOn(mixpanel, 'identify');
    heapIdentifySpy = jest.spyOn(heap, 'identify');
  });

  afterEach(() => {
    mixpanelTestSpy.mockClear();
    mixpanelTrackSpy.mockClear();
    mixpanelIdentifySpy.mockClear();
  });

  describe('track', () => {
    it('should not send tracking data if consumer is not found', () => {
      siddi = new Siddi([{ name: 'toogle' }]);
      siddi.track('unitTest.run', { where: 'mac' });
      expect(mixpanelTestSpy).not.toBeCalled();
    });
    it('should not send tracking data if consumer is defined but does not allow anything', () => {
      siddi = new Siddi([{ name: 'mixpanel', allow: [] }]);
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).not.toBeCalled();
    });
    it('should not send tracking data if consumer is defined but all denied', () => {
      siddi = new Siddi([{ name: 'mixpanel', deny: ['*'] }]);
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).not.toBeCalled();
    });
    it('should send tracking data if consumer allow and deny properties do not exist', () => {
      mixpanelTestSpy.mockReturnValue(true);
      siddi = new Siddi([{ name: 'mixpanel' }]);
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).toBeCalled();
      expect(mixpanelIdentifySpy).not.toBeCalled();
      expect(mixpanelTrackSpy).toBeCalledWith('unitTest.track', { run: 'second' });
    });
    it('should send tracking data if consumer allows all', () => {
      mixpanelTestSpy.mockReturnValue(true);
      siddi = new Siddi([{ name: 'mixpanel', allow: ['*'] }]);
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).toBeCalled();
      expect(mixpanelIdentifySpy).not.toBeCalled();
      expect(mixpanelTrackSpy).toBeCalledWith('unitTest.track', { run: 'second' });
    });
    it('should send tracking data if consumer allows all but deny non matching event name', () => {
      mixpanelTestSpy.mockReturnValue(true);
      siddi = new Siddi([{ name: 'mixpanel', allow: ['*'], deny: ['unitTest.run'] }]);
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).toBeCalled();
      expect(mixpanelIdentifySpy).not.toBeCalled();
      expect(mixpanelTrackSpy).toBeCalledWith('unitTest.track', { run: 'second' });
    });
    it('should send tracking data if consumer allows given event name', () => {
      mixpanelTestSpy.mockReturnValue(true);
      siddi = new Siddi([{ name: 'mixpanel', allow: ['unitTest.track'] }]);
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).toBeCalled();
      expect(mixpanelIdentifySpy).not.toBeCalled();
      expect(mixpanelTrackSpy).toBeCalledWith('unitTest.track', { run: 'second' });
    });
    it('should send tracking data if consumer allows given event name and deny non matching event name', () => {
      mixpanelTestSpy.mockReturnValue(true);
      siddi = new Siddi([{ name: 'mixpanel', allow: ['unitTest.track'], deny: ['unitTest.run'] }]);
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).toBeCalled();
      expect(mixpanelIdentifySpy).not.toBeCalled();
      expect(mixpanelTrackSpy).toBeCalledWith('unitTest.track', { run: 'second' });
    });
    it('should identify the user if not already done', () => {
      mixpanelTestSpy.mockReturnValue(true);
      siddi = new Siddi([{ name: 'mixpanel' }]);
      siddi.identify('user-id', { name: 'Siddi' });
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).toBeCalled();
      expect(mixpanelIdentifySpy).toHaveBeenCalledWith('user-id');
      expect(mixpanelTrackSpy).toBeCalledWith('unitTest.track', { run: 'second' });
    });
    it('should not identify the user if already done', () => {
      mixpanelTestSpy.mockReturnValue(true);
      siddi = new Siddi([{ name: 'mixpanel' }]);
      siddi.identify('user-id', { name: 'Siddi' });
      siddi.track('unitTest.track', { run: 'second' });
      expect(mixpanelTestSpy).toBeCalled();
      expect(mixpanelIdentifySpy).toHaveBeenCalledWith('user-id');
      expect(mixpanelTrackSpy).toBeCalledWith('unitTest.track', { run: 'second' });

      siddi.track('app.error', { type: 'unhandled' });
      expect(mixpanelTrackSpy).toBeCalledWith('app.error', { type: 'unhandled' });
      expect(mixpanelIdentifySpy).toBeCalledTimes(1);
    });
    it('should send event data to active consumers only', () => {
      siddi = new Siddi([{ name: 'mixpanel' }, { name: 'heap' }]);
      siddi.identify('app-user');
      siddi.track('app.login', { status: 'failed' });

      expect(mixpanelIdentifySpy).toHaveBeenCalledWith('app-user');
      expect(mixpanelTrackSpy).toBeCalledWith('app.login', { status: 'failed' });
      expect(heapIdentifySpy).not.toBeCalled();
    });
    it('should enable consumer if it is active after inactivity', () => {
      mixpanelTestSpy.mockReturnValue(false);
      siddi = new Siddi([{ name: 'mixpanel' }]);
      siddi.track('unitTest.track', { run: 'second' });

      expect(mixpanelTrackSpy).not.toBeCalled();

      // Make the consumer active. tracking data must go through
      mixpanelTestSpy.mockReturnValue(true);
      siddi.track('unitTest.track', { run: 'last' });
      expect(mixpanelTrackSpy).toBeCalledWith('unitTest.track', { run: 'last' });
    });
  });
});
