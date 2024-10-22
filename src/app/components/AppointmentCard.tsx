"use client";

import { differenceInMinutes } from "date-fns";
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  StatusEnum,
  TAppointmentQuery,
  TAppointmentResponse,
} from "@/common/types";
import { formatDateWithTimezone } from "@/common/utils";
import { Tooltip } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAppointment, editAppointmentStatus } from "@/services";

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

const statusColors = {
  opened: {
    background: "bg-orange-100 border-orange-300",
    textStrong: "text-orange-900",
    textThin: "text-orange-700",
  },
  closed: {
    background: "bg-green-100 border-green-300",
    textStrong: "text-green-900",
    textThin: "text-green-700",
  },
  missed: {
    background: "bg-red-100 border-red-300",
    textStrong: "text-red-900",
    textThin: "text-red-700",
  },
};

export default function AppointmentCard({ appointment, querySetters }: TProps) {
  const queryClient = useQueryClient();

  const appointmentStatusMutation = useMutation({
    mutationFn: editAppointmentStatus,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["appointmentsData"] });
      }
    },
  });

  const appointmentDeletionMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["appointmentsData"] });
      }
    },
  });

  function handleEditAppt(appt: TAppointmentResponse | null) {
    const query = { ...appt, isEdit: true } as TAppointmentQuery;
    querySetters.setAppointmentQuery(query);
    querySetters.setApptModalOpen(true);
  }

  function handleChangingStatus(status: StatusEnum) {
    appointmentStatusMutation.mutate({ id: appointment.id, status });
  }

  function handleDelete() {
    appointmentDeletionMutation.mutate(appointment.id);
  }

  const currentStatus = appointment.status || "opened";

  return (
    <Tooltip
      placement="top-end"
      closeDelay={0}
      offset={-8}
      classNames={{ content: "py-2 px-3" }}
      content={
        <div className="flex gap-x-2">
          <button
            className="h-5 w-5 hover:scale-125 transition-all"
            onClick={() => handleDelete()}
          >
            <TrashIcon className="stroke-red-800" />
          </button>

          <button
            className="h-5 w-5 hover:scale-125 transition-all"
            onClick={() => handleChangingStatus(StatusEnum.MISSED)}
          >
            <XCircleIcon className="stroke-amber-600" />
          </button>

          <button
            className="h-5 w-5 hover:scale-125 transition-all"
            onClick={() => handleChangingStatus(StatusEnum.CLOSED)}
          >
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
        <div
          className={`${statusColors[currentStatus].background} w-full h-full border text-left rounded-2xl px-3 py-2 text-slate-950`}
        >
          <div
            className={`${statusColors[currentStatus].textStrong} text-sm font-bold`}
          >
            {appointment.patientName} & {appointment.professionalName}
          </div>

          <div className={`${statusColors[currentStatus].textThin} text-xs`}>
            {appointmentTime(appointment)}
          </div>

          {appointment.observation ? (
            <div
              className={`${statusColors[currentStatus].textStrong} text-xs mt-1`}
            >
              {appointment.observation}
            </div>
          ) : null}
        </div>
      </button>
    </Tooltip>
  );
}
