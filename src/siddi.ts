import { Consumers } from './consumers/browser';

/**
 * Event consumer configuration object.
 * It is mandatory to have an event configuration for a consumer, but allow/deny properties are optional.
 * Consumer configuration having just a consumer name implies that all events will be sent to that consumer.
 * Granular control of the consumer can be achieved via allow/deny configuration.
 * For certain consumers we can limit the event digestion, using the deny property we can define which event should not be sent to
 * the consumer.
 * Allow/deny properties can have,
 * - *: affects all events
 * - specific events by namespace which only affects what is matching
 * ie: If we deny 'app.user.' namespace, all events starting with that namespace will get affected
 * Usage:
 * 1. { name: 'mixpanel' } --> All events will be sent
 * 2. { name: 'mixpanel', allow: [] } --> No events will be allowed
 * 3. { name: 'mixpanel', allow: [ '*' ] } --> All events will be sent
 * 4. { name: 'mixpanel', allow: [ 'site.' ] } --> All site events will be sent
 * 5. { name: 'mixpanel', allow: [ '*' ], deny: [ 'site.login.', 'app.user.' ] } --> Do not send site.login.* and app.user.* events
 * 6. { name: 'mixpanel', deny: [ 'user.collab.' ] } --> Do not send user.collab.* events
 * 7. { name: 'mixpanel', denyParameters: [ {eventId: 'user.login.failed', parameters: ['location'] } ] } --> Do not send location parameter with user.login.failed event
 */
export type EventConfiguration = { name: string; allow?: string[]; deny?: string[]; denyParameters?: any };

/**
 * Siddi event consumer type
 * test: Function which returnes a boolean based on consumer is initialized and active
 * track: Tracking function implementation based on consumer API
 * identify: User identification function implementation based on consumer API
 */
export interface Consumer {
  test: Function;
  identify: (userId: string, userProperties: object) => void;
  track: (eventName: string, eventProperties: object) => void;
  init?: Function
}

/**
 * Siddi - An abstract event consumer
 * This implements a more abstract version of a event consumer which will send out events to multiple consumers
 * which are already loaded and initialized by the application which uses this.
 */
export class Siddi {
  /**
   * Default consumer configuration
   */
  private readonly defaultConsumerRule = { allow: ['*'], deny: [] };

  /**
   * Current status of the event consumers
   */
  private consumerStatus: { [name: string]: { enabled: boolean; identified: boolean } } = {};

  /**
   * Current user
   */
  private user: { id: string; properties: any };

  /**
   * Constructor
   * @param consumerConfig Event configuration object
   */
  public constructor(
    private consumerConfig: EventConfiguration[],
    private _consumers: Record<string, Consumer> = Consumers
  ) {
    this.user = { id: '', properties: undefined };
    Object.values(this._consumers).forEach(consumer => consumer.init && consumer.init());
  }

  /**
   * Identify the current user with the event consumers. After the identification
   * and event being tracked will automatically belong this user.
   * @param userId Current user id
   * @param userProperties any additional properties of the user
   */
  public identify(userId: string, userProperties?: any): void {
    this.user.id = userId;
    this.user.properties = userProperties;
  }

  /**
   * Track a given event
   * @param eventName meaningfull name for the event
   * @param eventProperties additional event properties
   */
  public track(eventName: string, eventProperties: any): void {
    this.consumerConfig.forEach(config => {
      // Assign event properties to a new obeject
      let filteredEventProperties = Object.assign({}, eventProperties);
      // consumer name must exist, else ignore it
      if (config.name && this._consumers[config.name] && this.shouldTrack(config, eventName)) {
        // If no consumer status tracking exist, check it first
        if (this.consumerStatus[config.name]) {
          // Status exists, re-ckeck if consumer is enabled and initialized, if it is not enabled
          if (!this.consumerStatus[config.name].enabled && this._consumers[config.name].test()) {
            this.consumerStatus[config.name].enabled = true;
          }
        } else {
          // Add status info of the new consumer
          if (this._consumers[config.name].test()) {
            this.consumerStatus[config.name] = { enabled: true, identified: false };
          } else {
            this.consumerStatus[config.name] = { enabled: false, identified: false };
          }
        }

        // Exclude sending event parameters for particular event
        // when those defined in denyParameters config
        if (eventProperties && config.denyParameters) {
          config.denyParameters.some(function (element: any, index: number) {
            if (element.eventId === eventName) {
              config.denyParameters[index].parameters.forEach(function (property: string) {
                delete filteredEventProperties[property];
              });
            }
          });
        }

        // Track the event only if consumer is in enabled status
        // We do not send tracking data to consumers knowingly that they would fail
        if (this.consumerStatus[config.name].enabled) {
          if (this.user.id && !this.consumerStatus[config.name].identified) {
            // Identify the user
            this._consumers[config.name].identify(this.user.id, this.user.properties);
            this.consumerStatus[config.name].identified = true;
          }
          new Promise(resolve => {
            this._consumers[config.name].track(eventName, filteredEventProperties);
            resolve(true);
          });
        }
      }
    });
  }

  /**
   * Check whether the event should be sent to the given consumer.
   * 1. { name: 'mixpanel' } --> All events will be sent
   * 2. { name: 'mixpanel', allow: [] } --> No events will be allowed
   * 3. { name: 'mixpanel', allow: [ '*' ] } --> All events will be sent
   * 4. { name: 'mixpanel', allow: [ 'site.' ] } --> All site events will be sent
   * 5. { name: 'mixpanel', allow: [ '*' ], deny: [ 'site.login.', 'app.user.' ] } --> Do not send site.login.* and app.user.* events
   * 6. { name: 'mixpanel', deny: [ 'user.collab.' ] } --> Do not send user.collab.* events
   * @param consumer target event consumer
   * @param eventName event name
   */
  private shouldTrack(consumerConfig: EventConfiguration, eventName: string): boolean {
    const config = Object.assign({}, this.defaultConsumerRule, consumerConfig);

    const denyOptions = config.deny;
    const allowOptions = config.allow;

    if (
      !(
        allowOptions.filter(c => c === '*').length > 0 || allowOptions.filter(c => eventName.indexOf(c) > -1).length > 0
      )
    ) {
      return false;
    }

    if (
      denyOptions.filter(c => c === '*').length > 0 ||
      denyOptions.filter(c => eventName.indexOf(c) > -1).length > 0
    ) {
      return false;
    }

    return true;
  }
}

export { Consumers as BrowserConsumers } from './consumers/browser';
export { Consumers as ServerConsumers } from './consumers/node';
