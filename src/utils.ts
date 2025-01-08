const prepareMatomoDimensions = (eventProperties: any) => {
  return Object.entries(eventProperties).reduce((evProps: Record<string, any>, [k, v]) => {
    if (/value[0-9]Type/.test(k)) {
      return evProps;
    }
    const regexParts = /value([0-9])$/.exec(k) || [];
    if (!regexParts[1]) {
      return { ...evProps, [k]: v };
    }
    return { ...evProps, [`dimension${parseInt(regexParts[1]) + 3}`]: v };
  }, {});
};

export { prepareMatomoDimensions };
