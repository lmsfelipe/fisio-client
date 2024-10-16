"use client";

import * as z from "zod";
import { addMinutes, differenceInMinutes } from "date-fns";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsBoolean, parseAsJson, useQueryState } from "nuqs";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";

import {
  appointmentDuration,
  formatDateWithTimezone,
  minutesToHours,
  quarterHours,
} from "@/common/utils";
import { revalidatePathAction } from "@/app/actions";
import {
  createAppointment,
  editAppointment,
  findPatients,
  findProfessionals,
} from "@/services";
import { TAppointmentQuery } from "@/common/types";

const createAppointmentSchema = z.object({
  dateStart: z.any(),
  time: z.string().min(2),
  duration: z.string().min(2),
  location: z.enum(["clinic", "home"]),
  observation: z.string(),
  patientId: z.string().min(2, { message: "Required" }),
  professionalId: z.string().min(2, { message: "Required" }),
});

type TAppointmentsInputs = z.infer<typeof createAppointmentSchema>;

export default function AppointmentModal() {
  const [hasError, setHasError] = useState(false);

  /**
   * Route query
   */
  const [appointmentQuery, setAppointmentQuery] =
    useQueryState<TAppointmentQuery>("appt", parseAsJson());

  const [, setApptModalOpen] = useQueryState("appt-modal", parseAsBoolean);

  function closeModal() {
    setApptModalOpen(null);
    setAppointmentQuery(null);
  }

  /**
   * API request
   */
  const ownerId = "e30c0aac-9321-448f-80c3-e246d64aaab3"; // TODO: get it form service

  const { data: patients } = useQuery({
    queryKey: ["patients", ownerId],
    queryFn: () => findPatients(ownerId),
  });

  const { data: professionals } = useQuery({
    queryKey: ["professionals", ownerId],
    queryFn: () => findProfessionals(ownerId),
  });

  const appointmentMutation = useMutation({
    mutationFn: appointmentQuery?.isEdit ? editAppointment : createAppointment,
    onSuccess: (response) => {
      if (response.success) {
        closeModal();
        revalidatePathAction(
          `/find-professionals-appointments?date=2024-09-10`
        );
      }
    },
  });

  /**
   * Form section
   */
  const defaultValues = {
    ...appointmentQuery,
    dateStart: today(getLocalTimeZone()), // TODO: Create function for get  today
    ...(appointmentQuery?.dateStart
      ? {
          time: formatDateWithTimezone(appointmentQuery.dateStart, "HH:mm"),
          duration: differenceInMinutes(
            appointmentQuery.dateEnd,
            appointmentQuery.dateStart
          ).toString(),
          dateStart: parseDate(
            formatDateWithTimezone(appointmentQuery.dateStart)
          ),
        }
      : {}),
  };

  delete defaultValues.dateEnd;
  delete defaultValues.professionalName;
  delete defaultValues.patientName;

  const {
    register,
    handleSubmit,
    control,
    // formState: { errors }, TODO: validade errors
  } = useForm<TAppointmentsInputs>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<TAppointmentsInputs> = (data) => {
    const {
      dateStart,
      time,
      duration,
      location,
      observation,
      patientId,
      professionalId,
    } = data;

    const splitedTime = time.split(":");
    const newDate = dateStart || defaultValues?.dateStart;
    const convertedDate = newDate.toDate();

    convertedDate
      .setHours(parseInt(splitedTime[0]), parseInt(splitedTime[1]), 0)
      .toString();

    const dateEnd = addMinutes(convertedDate, parseInt(duration, 10));

    const payload = {
      ...(appointmentQuery?.isEdit ? { id: appointmentQuery.id } : {}),
      dateStart: convertedDate,
      dateEnd,
      location,
      observation,
      patientId,
      professionalId,
    };

    appointmentMutation.mutate(payload);
  };

  if (!professionals?.length || !patients?.length)
    return <h1>Data não carregada</h1>;

  return (
    <div className={`modal modal-open`}>
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
            onClick={closeModal}
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>

          <div className="flex flex-col gap-5">
            <div className="flex gap-2">
              <Controller
                name="dateStart"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    minValue={today(getLocalTimeZone())}
                    label="Quando?"
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />

              <Autocomplete
                label="Qual hora?"
                className="max-w-xs"
                placeholder="Digite ou selecione"
                validationBehavior="native"
                {...register("time")}
              >
                {quarterHours.map((hour) => (
                  <AutocompleteItem value={hour} key={hour}>
                    {hour}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>

            <div className="flex gap-2">
              <Select
                label="Duração"
                placeholder="Selecione"
                className="max-w-xs"
                {...register("duration")}
              >
                {appointmentDuration.map((duration) => (
                  <SelectItem key={duration.toString()}>
                    {minutesToHours(duration)}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Onde?"
                placeholder="Selecione"
                className="max-w-xs"
                {...register("location")}
              >
                <SelectItem key="clinic">Clínica</SelectItem>
                <SelectItem key="home">Domiciliar</SelectItem>
              </Select>
            </div>

            <div className="flex gap-2">
              <Controller
                name="patientId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    label="Paciente"
                    placeholder="Digite ou selecione"
                    defaultItems={patients}
                    validationBehavior="native"
                    onSelectionChange={(selection) => field.onChange(selection)}
                    defaultSelectedKey={defaultValues?.patientId}
                  >
                    {(patients) => (
                      <AutocompleteItem key={patients.id} value={patients.id}>
                        {patients.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />

              <Controller
                name="professionalId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    label="Profissional"
                    defaultItems={professionals}
                    placeholder="Digite ou selecione"
                    validationBehavior="native"
                    onSelectionChange={(selection) => field.onChange(selection)}
                    defaultSelectedKey={defaultValues?.professionalId}
                  >
                    {(professionals) => (
                      <AutocompleteItem
                        key={professionals.id}
                        value={professionals.id}
                      >
                        {professionals.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
            </div>

            <div>
              <Textarea
                label="Observação"
                placeholder="Algo a acrescentar?"
                {...register("observation")}
              />
            </div>

            <button type="submit" className="btn btn-primary mt-2">
              {appointmentQuery?.isEdit ? "Editar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
