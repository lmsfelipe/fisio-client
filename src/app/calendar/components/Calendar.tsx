// "use client";

import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { TProfessionalWithAppoitments } from "@/common/types";
import { AppointmentsColumn } from "./AppointmentsColumn";
import { formatDateWithTimezone, roundedHours } from "@/common/utils";
import { findProfessionalsAppointments } from "@/services";

async function getData(dateQuery: string) {
  const res = await findProfessionalsAppointments(dateQuery);

  if (!res?.length) throw new Error("Owner not found");

  return res;
}

export default async function Calendar({
  dateQuery,
}: {
  dateQuery: string | null;
}) {
  const today = formatDateWithTimezone(new Date(), "yyyy-MM-dd");
  const queryDate = dateQuery || today;

  const data = await getData(queryDate);

  return (
    <div className="inline-flex bg-slate-50 rounded-xl m-6 p-4">
      <div className="mr-4">
        <div className="font-bold h-8 w-6 mb-9 flex items-center">
          <CalendarDaysIcon />
        </div>

        {roundedHours.map((hour) => (
          <div
            key={uuidv4()}
            className="text-sm text-slate-800 h-20 w-5 relative"
          >
            <div className="clalendar-hour absolute" style={{ bottom: "90%" }}>
              {hour.split(":")[0]}h
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        {data?.length ? (
          data.map((professional: TProfessionalWithAppoitments) => (
            <div key={professional.id}>
              <div className="font-black h-8 text-2xl mb-9 text-center">
                {professional.name}
              </div>

              <AppointmentsColumn appointments={professional.appointments} />
            </div>
          ))
        ) : (
          <div>Carregando...</div>
        )}
      </div>
    </div>
  );
}
