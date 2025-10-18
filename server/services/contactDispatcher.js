const sendContactNotification = async (payload, logger) => {
  logger?.info('contact_dispatch_stub', {
    requestId: payload.meta.requestId,
    hasMessage: Boolean(payload.message?.length),
  });
  // Hook for future integrations (email, SIEM, ticketing)
  return Promise.resolve();
};

module.exports = { sendContactNotification };
