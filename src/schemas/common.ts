import { z } from 'zod';

export const rolesEnum = z.enum(['MASTER', 'ADMIN', 'CLEANER', 'BILLING']);

export const preferredFrequencyEnum = z.enum([
  'ONE_TIME',
  'EVERY_OTHER_DAY',
  'DAILY',
  'WEEKLY',
  'BI_WEEKLY',
  'MONTHLY',
  'EVERY_THREE_WEEKS',
  'EVERY_FIVE_WEEKS',
  'EVERY_FOUR_WEEKS',
  'EVERY_SIX_WEEKS',
  'EVERY_EIGHT_WEEKS',
  'EVERY_TWELVE_WEEKS',
  'FIRST_OF_MONTH',
  'SECOND_OF_MONTH',
  'THIRD_OF_MONTH',
  'FOURTH_OF_MONTH',
  'LAST_OF_MONTH',
  'WEEK_DAYS',
]);

export const preferredDayEnum = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

export const paymentMethodEnum = z.enum([
  'CASH',
  'CHECK',
  'CARD',
  'PAYPAL',
  'VENMO',
  'ZELLE',
  'SQUARE',
  'BANK_TRANSFER',
  'QUICKBOOKS',
  'MULTIPLE',
  'OTHER',
]);

export const chargeByEnum = z.enum([
  'FIXED',
  'PRESET_HOURS',
  'WORKED_HOURS',
  'PRESET_CLEANER_HOURS',
  'WORKED_CLEANER_HOURS',
]);

export const entryMethodEnum = z.enum([
  'OPEN_DOOR',
  'KEY',
  'KEY_COPY',
  'CODE',
  'CALL',
  'CLIENT_AT_HOME',
]);
