import { Consumers } from './consumers';

/**
 * Event consumer configuration object.
 * It is not mandatory to have an event configuration for a consumer.
 * Granular control of the consumer can be achieved via this configuration.
 * If a configuration does not exist for a given consumer, all tracked
 * events sent to the consumer without any restrictions. For certain consumers we can limit
 * the event digestion, and allow and deny properties does what they implies.
 * Allow/deny property can have,
 * - all: affects all events
 * - specific events by namespace which only affects what is matching
 * ie: If we deny 'proton.user.' namespace, all events starting with that namespace will get affected
 */
export type ConsumerConfig = { name: string; allow?: string[]; deny?: string[] };

/**
 * Complete event consumer configuration object
 */
export type EventConfig = {
  consumers?: Array<ConsumerConfig>;
};

/**
 * Siddi - An abstract event consumer
 * This implements a more abstract version of a event consumer which will send out events to multiple consumers
 * which are already loaded and initialized by the application which uses this.
 */
export class Siddi {
  /**
   * Current status of the event consumers
   */
  protected consumerStatus: { [name: string]: { enabled: boolean; identified: boolean } } = {};

  /**
   * Current user
   */
  protected user: { id: string; properties: any };

  /**
   * Constructor
   * @param eventConfig Event configuration object
   */
  public constructor(private eventConfig: EventConfig = {}) {
    this.user = { id: '', properties: undefined };
  }

  /**
   * Identify the current user with the event consumers. After the identification
   * and event being tracked will automatically belong this user.
   * @param userId Current user id
   * @param userProperties any additional properties of the user
   */
  public identify(userId: string, userProperties: any): void {
    this.user.id = userId;
    this.user.properties = userProperties;
  }

  /**
   * Track a given event
   * @param eventName meaningfull name for the event
   * @param eventProperties additional event properties
   */
  public track(eventName: string, eventProperties: any): void {
    Consumers.forEach(consumer => {
      if (this.shouldTrack(consumer.name, eventName)) {
        if (this.consumerStatus[consumer.name] && !this.consumerStatus[consumer.name].enabled) {
          if (consumer.test()) {
            this.consumerStatus[consumer.name].enabled = true;
          }
        } else {
          if (consumer.test()) {
            this.consumerStatus[consumer.name] = { enabled: true, identified: false };
          } else {
            this.consumerStatus[consumer.name] = { enabled: false, identified: false };
          }
        }

        if (this.user.id && !this.consumerStatus[consumer.name].identified) {
          // Identify the user
          consumer.identify(this.user.id, this.user.properties);
          this.consumerStatus[consumer.name].identified = true;
        }

        consumer.track(eventName, eventProperties);
      }
    });
  }

  /**
   * Check whether the event should be sent to the given consumer.
   * @param consumer target event consumer
   * @param eventName event name
   */
  private shouldTrack(consumer: string, eventName: string): boolean {
    const consumerConfig = this.getConsumerConfig(consumer).pop();

    // Check all allowed
    const allAllowed =
      consumerConfig && consumerConfig.allow && consumerConfig.allow.filter(c => c === 'all').length > 0;
    if (allAllowed) {
      return true;
    }

    // Check all denied
    const allDenied = consumerConfig && consumerConfig.deny && consumerConfig.deny.filter(c => c === 'all').length > 0;
    if (allDenied) {
      return false;
    }

    // Check specifically allowed
    const specAllowed =
      consumerConfig && consumerConfig.allow && consumerConfig.allow.filter(c => eventName.indexOf(c) > -1).length > 0;
    if (specAllowed) {
      return true;
    }

    // Check specifically denied
    const specDenied =
      consumerConfig && consumerConfig.deny && consumerConfig.deny.filter(c => eventName.indexOf(c) > -1).length > 0;
    if (specDenied) {
      return false;
    }

    // If nothing matches, deny
    return false;
  }

  /**
   * Return the event consumer configuration of a given consumer. If a configuration does not exist
   * it is assumed that full tracking is allowed for that consumer.
   * @param consumer target consumer
   */
  private getConsumerConfig(consumer: string): ConsumerConfig[] {
    if (this.eventConfig.consumers) {
      const consumers = this.eventConfig.consumers.filter(conf => conf.name === consumer);
      if (consumers && consumers.length > 0) {
        return consumers;
      }
    }
    return [{ name: consumer, allow: ['all'] }];
  }
}
