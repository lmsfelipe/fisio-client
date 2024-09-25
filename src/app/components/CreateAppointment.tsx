"use client";

import { Button, Calendar } from "@nextui-org/react";
import { DateValue } from "@react-types/calendar";
import { usePathname, useRouter } from "next/navigation";
import { getLocalTimeZone, today } from "@internationalized/date";
import { parseAsBoolean, useQueryState } from "nuqs";

import AppointmentModal from "./AppointmentModal";

export default function CreatAppointment() {
  const path = usePathname();
  const { replace } = useRouter();

  function handleDate(date: DateValue) {
    replace(`${path}?date=${date.toString()}`);
  }

  const [apptModalOpen, setApptModalOpen] = useQueryState(
    "appt-modal",
    parseAsBoolean
  );

  console.log("apptModalOpen", apptModalOpen);

  return (
    <div>
      <div className="mt-6">
        <Calendar
          aria-label="Date (Controlled)"
          defaultValue={today(getLocalTimeZone())}
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
            // headerWrapper
          }}
        />
      </div>

      <div className="py-6 w-full">
        <Button
          onClick={() => setApptModalOpen(true)}
          size="lg"
          className="bg-white text-primary"
          fullWidth
        >
          Criar Agendamento
        </Button>
      </div>

      {apptModalOpen && <AppointmentModal />}
    </div>
  );
}
