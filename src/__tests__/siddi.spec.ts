import { MockSiddi } from './siddi.mock';

describe( 'Siddi', () => {
    let siddi: MockSiddi;
    beforeEach(() => {
        siddi = new MockSiddi();
    });
    describe( 'identify', () => {
        it( 'should record given user and user properties', () => {
            siddi.identify( 'user-id', { name: 'Upali' });
            expect( siddi.user ).toEqual({ id: 'user-id', properties: { name: 'Upali' }});
        });
    });

    describe( 'track', () => {
        it( 'should identify the user if not identified yet', () => {
            expect( true ).toBe( false );
        });

        it('should not identify user if already identified', () => {
            expect( true ).toBe( false );
        });

        it('should check inactive consumer is active again', () => {
            expect( true ).toBe( false );
        });

        it('should track to consumer if it is active', () => {
            expect( true ).toBe( false );
        });

        it('should not try to send tracking data to consumer if it is not active', () => {
            expect( true ).toBe( false );
        });

        it('should send tacking data to multiple consumers which are active', () => {
            expect( true ).toBe( false );
        });

        it('should do nothing if all consumers are inactive', () => {
            expect( true ).toBe( false );
        });
    });
});