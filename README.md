# Siddi - A minimalistic abstraction for event tracking/analytic API
Siddi is an abstract API for event consumers. This simplifies managing several event trackers on an application.

## Why?
Obviously, every event consumer API is different from each other and managing multiple of them on a project is just a pain. What if we can abstract out the functionality and provide a minimal API to interact with whatever consumer we want?

This was inspired from [event-layer](https://github.com/kidGodzilla/event-layer) project but adds capability to control the event digestion by the consumers. We are not sending events to every consumer we support, or we have loaded. We send the events to the ones we specifically allow and we have a granular control over it.

## How?
Load the library as a regular npm module, create a Siddi instance with your event consumer configuration, and rock!

### APIs available
* track( eventName, eventProperties ): void

Sends the events to the configured consumers.

* identify( userId, userProperties ): void

Introduce the user to the consumers.

### Consumer Configuration
Everytime you need to get a `Siddi` instance, you have to pass an array of consumer configuration objects. The objects define which events being sent to the consumers.

```
[
    {
        name: string,
        allow?: string[],
        deny?: string[],
    },
]
```
* name

This is the name of the event consumer being configured. Name is mandatory and it effectively enables the consumer.

* allow

This is optional, default value is `allow: [ '*' ]`. If no value is specified, every event will be sent to the consumer ( if deny doesn't say no! ). You can specify an array of event ids, or namespaces you want. If so, Siddi will send only those events to the consumer.

* deny

This is optional, default value is `deny: []`. If no value is specified, this doesn't affect anything but the decision to send the events will be based on the evaluation of other options provided. If both allow and deny options exist, evaluation of the deny options will determine if the events will be sent to the consumer of not.

```
{ name: 'consumer' } // Send all events to the consumer
{ name: 'consumer', allow: [] } // No events will be sent to the consumer
{ name: 'consumer', allow: [ '*' ] } // Send all events to the consumer
{ name: 'consumer', allow: [ 'user.login.' ]  } // All events matching user.login.* will be sent to the consumer
{ name: 'consumer', deny: [ '*' ] } // No events will be sent to the consumer
{ name: 'consumer', allow: [ 'user.login.' ], deny: [ 'user.login.failed' ] } // Send all events which matches the namespace user.login.* but don't send user.login.failed event.
```

Configuration allows us to configure the consumers whatever the way we want, it up to you to decide.