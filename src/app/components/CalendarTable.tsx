import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";
import { Avatar, Tooltip } from "@nextui-org/react";
import { getHours, getMinutes } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import { TProfessionalWithAppoitments } from "@/common/types";
import { AppointmentsColumn } from "./AppointmentsColumn";
import { formatDateWithTimezone, roundedHours } from "@/common/utils";
import { findProfessionalsAppointments } from "@/services";
import { parseAsString, useQueryState } from "nuqs";

export function CalendarTable() {
  const [date] = useQueryState<string>("date", parseAsString);

  const today = formatDateWithTimezone(new Date(), "yyyy-MM-dd");

  const {
    data: appointmentsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["appointmentsData", date],
    queryFn: () => findProfessionalsAppointments(date || today),
  });

  const now = new Date();
  const currentTime = getHours(now) * 60 + getMinutes(now) - 420;
  const calculatePercentage = (currentTime * 100) / 780;

  if (isLoading) return <div>Carregando</div>;
  if (isError)
    return <div>Houve um erro ao carregar a lista de profissionais</div>;
  if (!appointmentsData?.length)
    return <div>Nenhum profissional cadastrado.</div>;

  return (
    <div className="inline-flex bg-slate-50 rounded-3xl px-14 py-10">
      <div className="mr-4">
        <div className="font-bold h-8 w-6 mb-9 flex items-center">
          <CalendarDaysIcon />
        </div>

        <div className="relative">
          <div
            className="absolute w-screen h-px mt-1 left-10 z-50 border-b-1 border-dashed border-b-slate-300"
            style={{
              top: `${calculatePercentage > 100 ? 0 : calculatePercentage}%`,
            }}
          >
            {/* <span className="block h-4 w-8 bg-slate-200" /> */}
          </div>

          {roundedHours.map((hour) => (
            <div
              key={uuidv4()}
              className="text-sm text-slate-800 h-32 w-5 relative"
            >
              <div
                className="clalendar-hour absolute z-10"
                style={{ bottom: "90%" }}
              >
                {hour.split(":")[0]}h
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        {appointmentsData.map((professional: TProfessionalWithAppoitments) => (
          <div key={professional.id}>
            <div className="mb-8 flex justify-center uppercase">
              <Tooltip showArrow content={professional.name}>
                <Avatar color="default" name={professional.name} />
              </Tooltip>
            </div>

            <AppointmentsColumn
              appointments={professional.appointments}
              professionalId={professional.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
