import '@testing-library/jest-dom';
import i18n from '../src/i18n';
import { TextEncoder, TextDecoder } from 'node:util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

if (typeof global.__API_BASE_URL__ === 'undefined') {
  global.__API_BASE_URL__ = '';
}

beforeEach(() => {
  i18n.changeLanguage('en');
});
