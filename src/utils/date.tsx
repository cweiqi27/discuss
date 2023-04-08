import { differenceInCalendarMonths, endOfYear, subYears } from "date-fns";
import { useMemo } from "react";

export const getMonthsMap = () => {
  const monthsMap = new Map<number, string>();
  monthsMap.set(1, "January");
  monthsMap.set(2, "February");
  monthsMap.set(3, "March");
  monthsMap.set(4, "April");
  monthsMap.set(5, "May");
  monthsMap.set(6, "June");
  monthsMap.set(7, "July");
  monthsMap.set(8, "August");
  monthsMap.set(9, "September");
  monthsMap.set(10, "October");
  monthsMap.set(11, "November");
  monthsMap.set(12, "December");
  return monthsMap;
};

export const getMonthsFromStartOfYearToNow = () => {
  return differenceInCalendarMonths(
    Date.now(),
    endOfYear(subYears(Date.now(), 1))
  );
};

export const useMonthsInYear = () => {
  return useMemo(() => {
    const monthsMap = getMonthsMap();
    const monthsFromStartOfYearToNow = getMonthsFromStartOfYearToNow();
    const monthsInYear = [];
    for (let i = 1; i < monthsFromStartOfYearToNow + 1; i++) {
      monthsInYear.push(monthsMap.get(i));
    }
    return { monthsInYear, monthsFromStartOfYearToNow };
  }, []);
};
