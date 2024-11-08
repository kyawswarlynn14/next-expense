"use cleint";

import { MONTHS, YEARS } from "@/lib/services";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store";
import { setYear } from "@/store/item/itemSlice";

type Props = {
  month: number,
  setMonth: React.Dispatch<React.SetStateAction<number>>,
}

const MonthYearPicker: React.FC<Props> = ({
  month, 
  setMonth, 
}) => {
  const { year } = useSelector((state: AppState) => state.item);
  const dispatch = useDispatch();

  return (
    <div className="flex space-x-2">
      <Select value={MONTHS[month]} onValueChange={(value) => setMonth(MONTHS.indexOf(value))}>
        <SelectTrigger className="w-[100px] md:w-[150px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent className="w-[150px]">
          {MONTHS.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year.toString()} onValueChange={(value) => dispatch(setYear(parseInt(value)))}>
        <SelectTrigger className="w-[100px] md:w-[150px]">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent className="w-[150px]">
          {YEARS.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthYearPicker;