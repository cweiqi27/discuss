import { env } from "env/client.mjs";

export const staffEmail = env.NEXT_PUBLIC_STAFF_EMAIL_DOMAIN;
export const studentEmail = env.NEXT_PUBLIC_STUDENT_EMAIL_DOMAIN;

export const randomRgba = () => {
  const o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    r().toFixed(1) +
    ")"
  );
};

/**
 *
 * @param oldValue should be the earlier number
 * @param newValue should be the later number
 * @returns a percentage increase or drop between the two numbers
 */
export const calcPercentageDiff = (oldValue: number, newValue: number) => {
  return oldValue === 0 && newValue === 0
    ? 0
    : oldValue === 0
    ? percentageDiffZero(oldValue, newValue)
    : ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

const percentageDiffZero = (oldValue: number, newValue: number) => {
  const diff = newValue - oldValue;
  const average = (oldValue + newValue) / 2;
  const percentage = (diff / average) * 100;
  return newValue > oldValue ? percentage : -Math.abs(percentage);
};
