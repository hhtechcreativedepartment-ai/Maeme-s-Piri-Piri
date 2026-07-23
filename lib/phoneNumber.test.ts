import assert from 'node:assert/strict';
import test from 'node:test';
import { findUserByPhone, formatUkPhoneInput, normalizePhoneNumber } from './phoneNumber.ts';

test('normalizes supported UK phone formats to one E.164 value', () => {
  const expected = '+447123456789';
  [
    '07123 456789',
    '07123456789',
    '+44 7123 456789',
    '+447123456789',
    '0044 7123 456789',
  ].forEach(value => assert.equal(normalizePhoneNumber(value), expected));
});

test('rejects incomplete UK phone numbers', () => {
  assert.equal(normalizePhoneNumber('07123 456'), null);
});

test('formats canonical and national input consistently', () => {
  assert.equal(formatUkPhoneInput('+447123456789'), '7123 456 789');
  assert.equal(formatUkPhoneInput('07123456789'), '7123 456 789');
});

test('finds a newly registered customer when login uses another valid format', () => {
  const registeredCustomer = {
    userId: 'new-customer',
    phone: normalizePhoneNumber('07123456789')!,
  };

  assert.equal(
    findUserByPhone([registeredCustomer], '+44 7123 456789')?.userId,
    registeredCustomer.userId
  );
  assert.equal(
    findUserByPhone([registeredCustomer], '0044 7123 456789')?.userId,
    registeredCustomer.userId
  );
});
