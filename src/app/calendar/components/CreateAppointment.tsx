"use client";

import { useState } from "react";
import { Button, Calendar } from "@nextui-org/react";
import { DateValue } from "@react-types/calendar";
import { usePathname, useRouter } from "next/navigation";
import { getLocalTimeZone, today } from "@internationalized/date";
import { parseAsBoolean, useQueryState } from "nuqs";

import AppointmentModal from "./AppointmentModal";

export default function CreatAppointment() {
  const [hasError, setHasError] = useState(false);

  const path = usePathname();
  const { replace } = useRouter();

  function handleDate(date: DateValue) {
    replace(`${path}?date=${date.toString()}`);
  }

  const [apptModalOpen, setApptModalOpen] = useQueryState(
    "appt-modal",
    parseAsBoolean
  );

  return (
    <div>
      <div className="py-6">
        <Button onClick={() => setApptModalOpen(true)}>
          Criar Agendamento
        </Button>
      </div>

      <Calendar
        aria-label="Date (Controlled)"
        defaultValue={today(getLocalTimeZone())}
        onChange={handleDate}
      />

      {apptModalOpen && <AppointmentModal />}
    </div>
  );
}
