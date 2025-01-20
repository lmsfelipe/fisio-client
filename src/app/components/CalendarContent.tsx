"use client";

import { formatDateWithTimezone } from "@/common/utils";
import { CalendarTable } from "./CalendarTable";

export default function Calendar({
  dateQuery,
}: {
  dateQuery: string | undefined;
}) {
  const today = formatDateWithTimezone(new Date(), "yyyy-MM-dd");
  const queryDate = dateQuery || today;

  return (
    <div className="m-4 w-11/12 overflow-x-auto">
      <div className="text-3xl text-white font-extrabold capitalize mb-4">
        <h1 className="drop-shadow-lg">
          {formatDateWithTimezone(queryDate, "EEEE, d 'de' MMMM")}
        </h1>
      </div>

      <CalendarTable />
    </div>
  );
}
