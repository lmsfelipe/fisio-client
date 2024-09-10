"use client";

import { differenceInMinutes } from "date-fns";
import { useMemo } from "react";

import { TAppointment } from "@/common/types";
import { formatDateWithTimezone, roundedHours } from "@/common/utils";
import { parseAsBoolean, parseAsJson, useQueryState } from "nuqs";

function calculateSize(appointment: TAppointment) {
  const sizes: Record<number, string> = {
    30: "50%",
    45: "75%",
    60: "100%",
    75: "125%",
    90: "150%",
    105: "175%",
    120: "200%",
    135: "225%",
    150: "250%",
    165: "275%",
    180: "300%",
  };

  const apptDuration = differenceInMinutes(
    appointment.dateEnd,
    appointment.dateStart
  );

  return sizes[apptDuration] || sizes[1];
}

function calculatePosition(dateStart: string) {
  const postions: Record<string, string> = {
    "0": "0",
    "15": "25%",
    "30": "50%",
    "45": "75%",
  };

  const minutes = formatDateWithTimezone(dateStart, "mm");

  return postions[minutes] || postions[0];
}

export function AppointmentsColumn({
  appointments,
}: {
  appointments: TAppointment[];
}) {
  const filteredAppointments = (appts: TAppointment[]) =>
    roundedHours.reduce<{ hour: string; data: TAppointment | null }[]>(
      (acc, curr) => {
        const foundAppt = appts.find(
          (appt) =>
            formatDateWithTimezone(appt.dateStart, "HH") === curr.split(":")[0]
        );

        if (foundAppt) acc.push({ hour: curr, data: foundAppt });
        else acc.push({ hour: curr, data: null });

        return acc;
      },
      []
    );

  const appointmentsMemo = useMemo(
    () => filteredAppointments(appointments),
    [appointments]
  );

  const [, setAppointmentQuery] = useQueryState<TAppointment>(
    "appt",
    parseAsJson()
  );

  const [, setApptModalOpen] = useQueryState("appt-modal", parseAsBoolean);

  function handleDate(appt: TAppointment | null) {
    setAppointmentQuery(appt);
    setApptModalOpen(true);
  }

  return (
    <div className="appointments-columns">
      {appointmentsMemo.map((appt, index) => (
        <div
          key={`${appt.hour}-${index}`}
          className="appointments-columns__cell h-20 w-48 border-t border-l-neutral-400 pr-2"
        >
          {appt.data ? (
            <button
              onClick={() => handleDate(appt.data)}
              className="appointments-columns__card relative w-full z-10 cursor-pointer"
              style={{
                height: calculateSize(appt.data),
                top: calculatePosition(appt.data.dateStart),
              }}
            >
              <div className="w-full h-full flex justify-center items-center bg-emerald-200 rounded-2xl p-2 text-slate-950">
                {appt.data.patientName}
              </div>
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}