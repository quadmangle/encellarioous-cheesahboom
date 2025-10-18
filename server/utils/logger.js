const createLogger = ({ service }) => {
  const base = { service };

  const serialize = (level, event, meta = {}) =>
    JSON.stringify({
      level,
      event,
      ...base,
      ...meta,
      timestamp: new Date().toISOString(),
    });

  return {
    info: (event, meta) => console.log(serialize('info', event, meta)),
    warn: (event, meta) => console.warn(serialize('warn', event, meta)),
    error: (event, meta) => console.error(serialize('error', event, meta)),
  };
};

module.exports = { createLogger };
