import en from '../../src/locales/en.json';
import es from '../../src/locales/es.json';

const flattenKeys = (input, prefix = '') =>
  Object.entries(input).flatMap(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value, nextKey);
    }
    return nextKey;
  });

describe('Localization parity', () => {
  it('keeps English and Spanish translation keys aligned', () => {
    const enKeys = new Set(flattenKeys(en));
    const esKeys = new Set(flattenKeys(es));

    expect(esKeys).toEqual(enKeys);
  });

  it('ensures the Spanish navigation label retains its accent', () => {
    expect(es.nav['business-ops']).toBe('Gestión');
  });
});
