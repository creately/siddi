/* to transform existing event properties to matomo dimensions */
export const prepareMatomoDimensions = (eventProperties: any) => {
  return Object.entries(eventProperties).reduce((evProps: Record<string, any>, [k, v]) => {
    if (/value[0-9]Type/.test(k)) {
      return evProps;
    }
    const regexParts = /value([0-9])$/.exec(k) || [];
    if (!regexParts[1]) {
      return { ...evProps, [k]: v };
    }
    /*
          IMPORTANT NOTE: Make sure parameters we are interested in (value1, value2, value3...) are
          mapped continuously in Matomo as dimensions when setting up because we are mapping these
          values to dimensions in continuous order and adds an offset(3) to disregard unwanted dimensions.
          ie: As of this implementation, our existing tracking events are mapped to dimension 4, 5, 6 in Matomo
              to value1, value2, value3 respectively. Siddi adds the offset 3 to tracking data received from
              clients(Nuclues, Phoenix, Gravity etc...) so the value1,2,3 is mapped to correct Matomo dimension
        */
    return { ...evProps, [`dimension${parseInt(regexParts[1]) + /* value-to-dimension mapping offset -> 3 */ 3}`]: v };
  }, {});
};

export const DEFAULT_LOG_PREFIX = '[Siddi]';
export const LOG_MSG = (message: string, prefix: string = DEFAULT_LOG_PREFIX) =>
  console.log(`${prefix}\t\t > ${message}`);
