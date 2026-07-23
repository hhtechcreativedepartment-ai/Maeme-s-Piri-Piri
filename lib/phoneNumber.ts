export function normalizePhoneNumber(value: string, countryCode = '44') {
  let digits = value.replace(/\D/g, '');
  const internationalPrefix = `00${countryCode}`;

  if (digits.startsWith(internationalPrefix)) {
    digits = digits.slice(internationalPrefix.length);
  } else if (digits.startsWith(countryCode)) {
    digits = digits.slice(countryCode.length);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) return null;
  return `+${countryCode}${digits}`;
}

export function formatUkPhoneInput(value: string) {
  const canonical = normalizePhoneNumber(value);
  let digits = canonical
    ? canonical.slice(3)
    : value.replace(/\D/g, '').replace(/^0044/, '').replace(/^44/, '').replace(/^0/, '').slice(0, 10);

  digits = digits.slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

export function maskPhoneNumber(value: string | null) {
  if (!value) return 'your mobile number';
  const canonical = normalizePhoneNumber(value);
  if (!canonical) return 'your mobile number';
  return `+44 •••• ••• ${canonical.slice(-3)}`;
}

export function findUserByPhone<T extends { phone: string }>(users: T[], phone: string) {
  const canonical = normalizePhoneNumber(phone);
  if (!canonical) return undefined;
  return users.find(user => normalizePhoneNumber(user.phone) === canonical);
}
