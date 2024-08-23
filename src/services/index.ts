import {
  TAppointment,
  TPatient,
  TProfessional,
  TProfessionalWithAppoitments,
} from "@/common/types";
import request from "./request";

export function findProfessionalsAppointments(
  date: string
): Promise<TProfessionalWithAppoitments[]> {
  return request<TProfessionalWithAppoitments[]>(
    `find-professionals-appointments?date=${date}`
  );
}

export function findPatients(id: string): Promise<TPatient[]> {
  return request<TPatient[]>(`find-patients/${id}`);
}

export function findProfessionals(id: string): Promise<TProfessional[]> {
  return request<TProfessional[]>(`find-professionals/${id}`);
}

export function createAppointment(
  payload: TAppointment
): Promise<{ success: boolean }> {
  return request(
    "create-appointment",
    {
      method: "POST",
    },
    payload
  );
}
