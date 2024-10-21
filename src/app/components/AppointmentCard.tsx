"use client";

import { differenceInMinutes } from "date-fns";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/outline";
import { TAppointmentQuery, TAppointmentResponse } from "@/common/types";
import { formatDateWithTimezone } from "@/common/utils";
import { Tooltip } from "@nextui-org/react";

function calculateSize(appointment: TAppointmentResponse) {
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

function appointmentTime(appt: TAppointmentResponse) {
  return `${formatDateWithTimezone(appt.dateStart, "hh:mm")} -
${formatDateWithTimezone(appt.dateEnd, "hh:mm")}`;
}

type TProps = {
  appointment: TAppointmentResponse;
  querySetters: {
    // eslint-disable-next-line no-unused-vars
    setAppointmentQuery: (query: TAppointmentQuery) => void;
    // eslint-disable-next-line no-unused-vars
    setApptModalOpen: (bool: boolean) => void;
  };
};

export default function AppointmentCard({ appointment, querySetters }: TProps) {
  function handleEditAppt(appt: TAppointmentResponse | null) {
    const query = { ...appt, isEdit: true } as TAppointmentQuery;
    querySetters.setAppointmentQuery(query);
    querySetters.setApptModalOpen(true);
  }

  return (
    <Tooltip
      placement="top-end"
      closeDelay={0}
      offset={-8}
      classNames={{ content: "py-2 px-3" }}
      content={
        <div className="flex gap-x-2">
          <button className="h-5 w-5 hover:scale-110 transition-all">
            <ArchiveBoxXMarkIcon className="stroke-red-800" />
          </button>

          <button className="h-5 w-5 hover:scale-110 transition-all">
            <XCircleIcon className="stroke-amber-600" />
          </button>

          <button className="h-5 w-5 hover:scale-110 transition-all">
            <CheckCircleIcon className="stroke-green-800" />
          </button>
        </div>
      }
    >
      <button
        key={appointment.patientId}
        onClick={() => handleEditAppt(appointment)}
        className="appointments-columns__card absolute w-full z-10 cursor-pointer overflow-hidden"
        style={{
          height: calculateSize(appointment),
          top: calculatePosition(appointment.dateStart),
        }}
      >
        <div className="w-full h-full bg-green-100 border border-green-300 text-left rounded-2xl px-3 py-2 text-slate-950">
          <div className="text-sm text-green-900 font-bold">
            {appointment.patientName} & {appointment.professionalName}
          </div>

          <div className="text-xs text-green-700">
            {appointmentTime(appointment)}
          </div>

          {appointment.observation ? (
            <div className="text-xs text-green-900 mt-1">
              {appointment.observation}
            </div>
          ) : null}
        </div>
      </button>
    </Tooltip>
  );
}
