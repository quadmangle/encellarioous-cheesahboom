const SECRET_SEED = 'ops-chattia-sealed-orchestrator';

const textEncoder = new TextEncoder();

const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
};

const fromBase64 = (value: string): ArrayBuffer => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const getCrypto = () => {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as typeof globalThis & { crypto?: Crypto }).crypto?.subtle) {
    return (globalThis as typeof globalThis & { crypto?: Crypto }).crypto!.subtle;
  }
  return undefined;
};

export const generateRandomId = (prefix: string): string => {
  const array = new Uint8Array(12);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else if ((globalThis as typeof globalThis & { crypto?: Crypto }).crypto?.getRandomValues) {
    (globalThis as typeof globalThis & { crypto?: Crypto }).crypto!.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return `${prefix}_${Array.from(array).map((b) => b.toString(16).padStart(2, '0')).join('')}`;
};

export const computeSessionSignature = async (sessionId: string): Promise<string> => {
  const subtle = getCrypto();
  const payload = textEncoder.encode(`${SECRET_SEED}:${sessionId}`);
  if (!subtle) {
    return btoa(`${SECRET_SEED}:${sessionId}`);
  }
  const key = await subtle.importKey('raw', textEncoder.encode(SECRET_SEED), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await subtle.sign('HMAC', key, payload);
  return toBase64(signature);
};

const deriveAesKey = async (signature: string) => {
  const subtle = getCrypto();
  if (!subtle) {
    return null;
  }
  const signatureBytes = textEncoder.encode(signature);
  const hashBuffer = await subtle.digest('SHA-256', signatureBytes);
  return subtle.importKey('raw', hashBuffer, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
};

export const encryptPayload = async (signature: string, payload: string): Promise<{ iv: string; data: string }> => {
  const subtle = getCrypto();
  if (!subtle) {
    const salted = `${signature}:${payload}`;
    return { iv: 'legacy', data: btoa(salted) };
  }
  const key = await deriveAesKey(signature);
  if (!key) {
    const salted = `${signature}:${payload}`;
    return { iv: 'legacy', data: btoa(salted) };
  }
  const ivBytes = new Uint8Array(12);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(ivBytes);
  } else if ((globalThis as typeof globalThis & { crypto?: Crypto }).crypto?.getRandomValues) {
    (globalThis as typeof globalThis & { crypto?: Crypto }).crypto!.getRandomValues(ivBytes);
  } else {
    for (let i = 0; i < ivBytes.length; i += 1) {
      ivBytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const encrypted = await subtle.encrypt({ name: 'AES-GCM', iv: ivBytes }, key, textEncoder.encode(payload));
  return { iv: toBase64(ivBytes.buffer), data: toBase64(encrypted) };
};

export const decryptPayload = async (signature: string, record: { iv: string; data: string }): Promise<string | null> => {
  const subtle = getCrypto();
  if (!subtle || record.iv === 'legacy') {
    try {
      const decoded = atob(record.data);
      return decoded.replace(`${signature}:`, '');
    } catch (error) {
      console.warn('Failed to decode legacy payload', error);
      return null;
    }
  }
  const key = await deriveAesKey(signature);
  if (!key) {
    return null;
  }
  try {
    const decrypted = await subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(fromBase64(record.iv)) },
      key,
      fromBase64(record.data)
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.warn('Failed to decrypt payload', error);
    return null;
  }
};

export const computeHmac = async (signature: string, payload: string): Promise<string> => {
  const subtle = getCrypto();
  const message = textEncoder.encode(`${signature}:${payload}`);
  if (!subtle) {
    return btoa(`${signature}:${payload}`);
  }
  const key = await subtle.importKey('raw', textEncoder.encode(signature), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const result = await subtle.sign('HMAC', key, message);
  return toBase64(result);
};

export const subtleCryptoAvailable = (): boolean => Boolean(getCrypto());
