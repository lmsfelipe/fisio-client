"use client";

import { differenceInMinutes, isAfter, parse } from "date-fns";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseAsBoolean, parseAsJson, useQueryState } from "nuqs";
import { getLocalTimeZone, today } from "@internationalized/date";

import { TAppointment, TAppointmentQuery, TSmallAppt } from "@/common/types";
import { formatDateWithTimezone, roundedHours } from "@/common/utils";

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

function appointmentTime(appt: TAppointment) {
  return `${formatDateWithTimezone(appt.dateStart, "hh:mm")} -
${formatDateWithTimezone(appt.dateEnd, "hh:mm")}`;
}

export function AppointmentsColumn({
  appointments,
  professionalId,
}: {
  appointments: TAppointment[];
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

  function handleEditAppt(appt: TAppointment | null) {
    const query = { ...appt, isEdit: true } as TAppointmentQuery;
    setAppointmentQuery(query);
    setApptModalOpen(true);
  }

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

          {appt.data ? (
            <button
              onClick={() => handleEditAppt(appt.data)}
              className="appointments-columns__card relative w-full z-10 cursor-pointer overflow-hidden"
              style={{
                height: calculateSize(appt.data),
                top: calculatePosition(appt.data.dateStart),
              }}
            >
              <div className="w-full h-full bg-orange-100 border border-orange-300 text-left rounded-2xl px-3 py-2 text-slate-950">
                <div className="text-sm text-yellow-900 font-bold">
                  {appt.data.patientName} & {appt.data.professionalName}
                </div>

                <div className="text-xs text-yellow-700">
                  {appointmentTime(appt.data)}
                </div>

                {appt.data.observation ? (
                  <div className="text-xs text-yellow-900 mt-1">
                    O paciente deverá ser atendido em conjunto com um auxiliar
                  </div>
                ) : null}
              </div>
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
