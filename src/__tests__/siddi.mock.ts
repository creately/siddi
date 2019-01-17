import { Siddi } from '../siddi';

export class MockSiddi extends Siddi {
    public user: any;
    public consumerStatus: any;

    constructor( eventConfig?: any ) {
        super( eventConfig );
    }
}