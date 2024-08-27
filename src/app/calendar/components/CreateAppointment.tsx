"use client";

import * as z from "zod";
import { addDays, addMinutes } from "date-fns";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Calendar } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { DateValue } from "@react-types/calendar";
import { getLocalTimeZone, today } from "@internationalized/date";
import { zodResolver } from "@hookform/resolvers/zod";

import { action } from "@/app/actions";
import {
  appointmentDuration,
  minutesToHours,
  quarterHours,
} from "@/common/utils";
import { createAppointment, findPatients, findProfessionals } from "@/services";

const createAppointmentSchema = z.object({
  date: z.date(),
  time: z.string().min(2),
  duration: z.string().min(2),
  location: z.enum(["clinic", "home"]),
  observation: z.string().min(2, { message: "Required" }),
  patientId: z.string().min(2, { message: "Required" }),
  professionalId: z.string().min(2, { message: "Required" }),
});

type TAppointmentsInputs = z.infer<typeof createAppointmentSchema>;

export default function CreatAppointment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const path = usePathname();
  const { replace } = useRouter();

  function handleDate(date: DateValue) {
    replace(`${path}?date=${date.toString()}`);
  }

  // Form
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<TAppointmentsInputs>({
    resolver: zodResolver(createAppointmentSchema),
  });

  const ownerId = "1e7176fb-81b0-4296-b4bc-8386997bf96e";

  const { data: patients, error } = useQuery({
    queryKey: ["patients", ownerId],
    queryFn: () => findPatients(ownerId),
  });

  const { data: professionals } = useQuery({
    queryKey: ["professionals", ownerId],
    queryFn: () => findProfessionals(ownerId),
  });

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: (response) => {
      if (response.success) {
        setIsModalOpen(false);
        action(`/find-professionals-appointments?date=2024-08-16`);
      }
    },
  });

  const onSubmit: SubmitHandler<TAppointmentsInputs> = (data) => {
    const {
      date,
      time,
      duration,
      location,
      observation,
      patientId,
      professionalId,
    } = data;

    const splitedTime = time.split(":");
    const newDate = addDays(date, 1);

    newDate
      .setHours(parseInt(splitedTime[0]), parseInt(splitedTime[1]), 0)
      .toString();

    const dateEnd = addMinutes(newDate, parseInt(duration, 10));

    const payload = {
      dateStart: newDate,
      dateEnd,
      location,
      observation,
      patientId,
      professionalId,
    };

    mutation.mutate(payload);
  };

  return (
    <div>
      <div className="py-6">
        <Button onClick={() => setIsModalOpen(true)}>Criar Agendamento</Button>
      </div>

      <Calendar
        aria-label="Date (Controlled)"
        defaultValue={today(getLocalTimeZone())}
        onChange={handleDate}
      />

      <div className={`modal ${isModalOpen && "modal-open"}`}>
        <div className="modal-box">
          <h3 className="text-2xl font-extrabold mb-5">Agendamento</h3>

          {hasError && (
            <div role="alert" className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>Não foi possível criar o agendamento.</span>

              <button
                onClick={() => setHasError(false)}
                type="button"
                className="btn btn-sm btn-circle btn-ghost right-2 top-2"
              >
                ✕
              </button>
            </div>
          )}

          <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>

            <div className="flex flex-col gap-5">
              <div className="flex gap-2">
                <input
                  className="input input-secondary"
                  type="date"
                  min="2024-08-15"
                  max="2024-12-31"
                  {...register("date", { valueAsDate: true })}
                />

                <select
                  className="select select-secondary w-full max-w-xs"
                  {...register("time")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Data inicial
                  </option>
                  {quarterHours.map((hour, index) => (
                    <option value={hour} key={`${hour}-${index}`}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <select
                  className="select select-secondary w-full max-w-xs"
                  {...register("duration")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Duração
                  </option>
                  {appointmentDuration.map((duration, index) => (
                    <option value={duration} key={`${duration}-${index}`}>
                      {minutesToHours(duration)}
                    </option>
                  ))}
                </select>

                <select
                  className="select select-secondary w-full max-w-xs"
                  {...register("location")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Onde?
                  </option>
                  <option value="clinic">Clínica</option>
                  <option value="home">Domiciliar</option>
                </select>
              </div>

              <div className="flex gap-2">
                <select
                  className="select select-secondary w-full max-w-xs"
                  {...register("patientId")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Paciente
                  </option>
                  {patients?.length &&
                    patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                </select>

                <select
                  className="select select-secondary w-full max-w-xs"
                  {...register("professionalId")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Profissional
                  </option>
                  {professionals?.length &&
                    professionals.map((professional) => (
                      <option key={professional.id} value={professional.id}>
                        {professional.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <textarea
                  className="textarea textarea-bordered textarea-secondary h-24 w-full"
                  placeholder="Observação"
                  {...register("observation")}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary mt-2">
                Criar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
