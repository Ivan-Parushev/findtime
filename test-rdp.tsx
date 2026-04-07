import React, { useState } from "react";
import { DayPicker } from "react-day-picker";

export function Test() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  return <DayPicker mode="multiple" selected={selectedDates} onSelect={setSelectedDates} />;
}
