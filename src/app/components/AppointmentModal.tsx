"use client";

import { useCallback, useEffect } from "react";
import * as z from "zod";
import { addMinutes, differenceInMinutes } from "date-fns";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsBoolean, parseAsJson, useQueryState } from "nuqs";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import {
  appointmentDuration,
  formatDateWithTimezone,
  minutesToHours,
  quarterHours,
} from "@/common/utils";
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

/**
 * Component initiation
 */
export default function AppointmentModal() {
  const queryClient = useQueryClient();

  /**
   * Route query
   */
  const [appointmentQuery, setAppointmentQuery] =
    useQueryState<TAppointmentQuery>("appt", parseAsJson());

  const [, setApptModalOpen] = useQueryState("appt-modal", parseAsBoolean);

  const closeModalCallBack = useCallback(() => {
    setApptModalOpen(null);
    setAppointmentQuery(null);
  }, [setApptModalOpen, setAppointmentQuery]);

  /**
   * API request
   */
  const ownerId = Cookies.get("owner-id");

  const { data: patients, error: patientsError } = useQuery({
    queryKey: ["patients", ownerId],
    queryFn: () => (ownerId ? findPatients(ownerId) : null),
  });

  const { data: professionals, error: professionalsError } = useQuery({
    queryKey: ["professionals", ownerId],
    queryFn: () => (ownerId ? findProfessionals(ownerId) : null),
  });

  const appointmentMutation = useMutation({
    mutationFn: appointmentQuery?.isEdit ? editAppointment : createAppointment,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["appointmentsData"] });
        closeModalCallBack();
      }
    },
    onError: () => {
      toast.error("Erro! Não foi possível criar o agendamento");
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
    formState: { errors },
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

  useEffect(() => {
    if (patientsError || professionalsError) {
      toast.error("Erro ao carregar lista de pacientes e profissionais");
      return closeModalCallBack();
    }
  }, [patientsError, professionalsError, closeModalCallBack]);

  if (!professionals?.length || !patients?.length) {
    return null;
  }

  return (
    <div className={`modal modal-open`}>
      <div className="modal-box">
        <h3 className="text-2xl font-extrabold mb-5">Agendamento</h3>

        <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
          <button
            onClick={closeModalCallBack}
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
                    isInvalid={!!errors.dateStart}
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
                isInvalid={!!errors.time}
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
                isInvalid={!!errors.duration}
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
                isInvalid={!!errors.location}
                {...register("location")}
              >
                <SelectItem key="clinic">Clínica</SelectItem>
                <SelectItem key="home">Domiciliar</SelectItem>
              </Select>
            </div>

            <div className="flex gap-2">
              {/* TODO: Componentize this input  */}
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
                    isInvalid={!!errors.patientId}
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
                    isInvalid={!!errors.professionalId}
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
                isInvalid={!!errors.observation}
                {...register("observation")}
              />
            </div>

            <Button type="submit" color="secondary">
              {appointmentQuery?.isEdit ? "Editar" : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
