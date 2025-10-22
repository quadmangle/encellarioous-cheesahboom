const SERVICE_WORKER_URL = '/service-worker.js';
const SERVICE_WORKER_SCOPE = '/';

type RegistrationConfig = {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
};

const registerWithConfig = async (config?: RegistrationConfig) => {
  try {
    const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
      scope: SERVICE_WORKER_SCOPE,
      type: 'module'
    });

    if (config?.onSuccess) {
      config.onSuccess(registration);
    }

    if (registration.waiting && config?.onUpdate) {
      config.onUpdate(registration);
    }

    registration.addEventListener('updatefound', () => {
      if (config?.onUpdate && registration.installing) {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting && registration.active) {
            config.onUpdate?.(registration);
          }
        });
      }
    });
  } catch (error) {
    console.error('Service worker registration failed', error);
  }
};

export const registerServiceWorker = (config?: RegistrationConfig) => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    return;
  }

  const registerNow = () => registerWithConfig(config);

  if (document.readyState === 'complete') {
    void registerNow();
  } else {
    window.addEventListener('load', registerNow, { once: true });
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
};
