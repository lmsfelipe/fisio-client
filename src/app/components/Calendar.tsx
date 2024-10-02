import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";

import { TProfessionalWithAppoitments } from "@/common/types";
import { AppointmentsColumn } from "./AppointmentsColumn";
import { formatDateWithTimezone, roundedHours } from "@/common/utils";
import { findProfessionalsAppointments } from "@/services";
import { Avatar } from "@nextui-org/react";

async function getData(dateQuery: string) {
  const res = await findProfessionalsAppointments(dateQuery);

  if (!res?.length) throw new Error("Owner not found");

  return res;
}

export default async function Calendar({
  dateQuery,
}: {
  dateQuery: string | undefined;
}) {
  const today = formatDateWithTimezone(new Date(), "yyyy-MM-dd");
  const queryDate = dateQuery || today;

  const data = await getData(queryDate);

  return (
    <div className="m-6">
      <div className="text-3xl text-white font-extrabold capitalize mb-4">
        {formatDateWithTimezone(queryDate, "EEEE, d 'de' MMMM")}
      </div>

      <div className="inline-flex bg-slate-50 rounded-3xl px-14 py-10">
        <div className="mr-4">
          <div className="font-bold h-8 w-6 mb-9 flex items-center">
            <CalendarDaysIcon />
          </div>

          {roundedHours.map((hour) => (
            <div
              key={uuidv4()}
              className="text-sm text-slate-800 h-32 w-5 relative"
            >
              <div
                className="clalendar-hour absolute"
                style={{ bottom: "90%" }}
              >
                {hour.split(":")[0]}h
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          {data?.length ? (
            data.map((professional: TProfessionalWithAppoitments) => (
              <div key={professional.id}>
                <div className="mb-8 flex justify-center uppercase">
                  <Avatar color="default" name={professional.name} />
                </div>

                <AppointmentsColumn
                  appointments={professional.appointments}
                  professionalId={professional.id}
                />
              </div>
            ))
          ) : (
            <div>Carregando...</div>
          )}
        </div>
      </div>
    </div>
  );
}
