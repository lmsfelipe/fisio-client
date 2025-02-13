"use client";

import { Calendar } from "@nextui-org/react";
import { DateValue } from "@react-types/calendar";
import { usePathname, useRouter } from "next/navigation";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

import AppointmentModal from "./AppointmentModal";
import CreateAppointmentButton from "./CreateAppointmentButton";

export default function CreatAppointment() {
  const path = usePathname();
  const { replace } = useRouter();

  // It's necessary to component identify query changes
  function handleDate(date: DateValue) {
    replace(`${path}?date=${date.toString()}`);
  }

  const [apptModalOpen, setApptModalOpen] = useQueryState(
    "appt-modal",
    parseAsBoolean
  );

  const [date] = useQueryState<string>("date", parseAsString);

  return (
    <div>
      <div className="mt-6">
        <Calendar
          aria-label="Date (Controlled)"
          defaultValue={date ? parseDate(date) : today(getLocalTimeZone())}
          onChange={handleDate}
          classNames={{
            base: "rounded-3xl bg-opacity-15",
            headerWrapper: "bg-opacity-5",
            title: "text-white",
            nextButton: "text-white",
            prevButton: "text-white",
            gridHeader: "bg-opacity-5",
            gridHeaderCell: "text-white",
            cellButton: "text-white",
          }}
        />
      </div>

      <div className="py-6 w-full">
        <CreateAppointmentButton openModal={setApptModalOpen} />
      </div>

      {apptModalOpen && <AppointmentModal />}
    </div>
  );
}
