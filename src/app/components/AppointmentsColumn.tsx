"use client";

import { isAfter, parse } from "date-fns";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseAsBoolean, parseAsJson, useQueryState } from "nuqs";
import { getLocalTimeZone, today } from "@internationalized/date";

import {
  TAppointmentQuery,
  TAppointmentResponse,
  TSmallAppt,
} from "@/common/types";
import { formatDateWithTimezone, roundedHours } from "@/common/utils";
import AppointmentCard from "./AppointmentCard";

export function AppointmentsColumn({
  appointments,
  professionalId,
}: {
  appointments: TAppointmentResponse[];
  professionalId: string;
}) {
  const [, setAppointmentQuery] = useQueryState<TAppointmentQuery | TSmallAppt>(
    "appt",
    parseAsJson()
  );
  const [, setApptModalOpen] = useQueryState("appt-modal", parseAsBoolean);

  const search = useSearchParams();

  const queryDate = search.get("date");
  const isAfterToday = queryDate ? isAfter(queryDate, new Date()) : false;

  function handleCreateAppointment(data: { hour: string }) {
    const date = queryDate || today(getLocalTimeZone());
    const parseDate = parse(
      `${date} ${data.hour}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );

    setAppointmentQuery({
      dateStart: parseDate.toISOString(),
      professionalId,
    });
    setApptModalOpen(true);
  }

  const filteredAppointments = (appts: TAppointmentResponse[]) =>
    roundedHours.reduce<{ hour: string; data: TAppointmentResponse[] | [] }[]>(
      (acc, curr) => {
        const foundAppt = appts.filter(
          (appt) =>
            formatDateWithTimezone(appt.dateStart, "HH") === curr.split(":")[0]
        );

        if (foundAppt.length) acc.push({ hour: curr, data: foundAppt });
        else acc.push({ hour: curr, data: [] });

        return acc;
      },
      []
    );

  const appointmentsMemo = useMemo(
    () => filteredAppointments(appointments),
    [appointments]
  );

  return (
    <div className="appointments-columns">
      {appointmentsMemo.map((appt, index) => (
        <div
          key={`${appt.hour}-${index}`}
          className="appointments-columns__cell relative h-32 w-48 border-t border-l-neutral-400 px-1"
        >
          {isAfterToday && (
            <div
              className="h-full w-full absolute left-0 hover:bg-slate-100 cursor-pointer"
              onClick={() => handleCreateAppointment(appt)}
            />
          )}

          {appt.data.length
            ? appt.data.map((item) => (
                <AppointmentCard
                  key={item.patientName}
                  appointment={item}
                  querySetters={{
                    setAppointmentQuery: setAppointmentQuery,
                    setApptModalOpen: setApptModalOpen,
                  }}
                />
              ))
            : null}
        </div>
      ))}
    </div>
  );
}
