import {
  StatusEnum,
  TAppointment,
  TPatientPayload,
  TPatientResponse,
  TProfessionalPayload,
  TProfessionalResponse,
  TProfessionalWithAppoitments,
  TUser,
} from "@/common/types";
import request from "./request";

export function findProfessionalsAppointments(
  date: string
): Promise<TProfessionalWithAppoitments[]> {
  return request<TProfessionalWithAppoitments[]>(
    `find-professionals-appointments?date=${date}`
  );
}

export function findUser(): Promise<TUser> {
  return request<TUser>("find-user");
}

export function findPatients(): Promise<TPatientResponse[]> {
  return request<TPatientResponse[]>("find-patients");
}

export function findProfessionals(): Promise<TProfessionalResponse[]> {
  return request<TProfessionalResponse[]>("find-professionals");
}

export function createAppointment(
  payload: TAppointment
): Promise<{ success: boolean; data: TAppointment }> {
  return request("create-appointment", { method: "POST" }, payload);
}

export function createPatient(
  payload: TPatientPayload
): Promise<{ success: boolean }> {
  return request("create-patient", { method: "POST" }, payload);
}

export function createProfessional(
  payload: TProfessionalPayload
): Promise<{ success: boolean }> {
  return request("create-professional", { method: "POST" }, payload);
}

export function editAppointment(
  payload: TAppointment
): Promise<{ success: boolean; data: TAppointment }> {
  return request("edit-appointment", { method: "PUT" }, payload);
}

export function deleteAppointment(id: number): Promise<{ success: boolean }> {
  return request("delete-appointment", { method: "DELETE" }, id);
}

export function editAppointmentStatus(payload: {
  id: number;
  status: StatusEnum;
}): Promise<{ success: boolean }> {
  return request("edit-status-appointment", { method: "PUT" }, payload);
}

export function login(payload: {
  email: string;
  password: string;
}): Promise<{ token: string; id: string; companyId: string }> {
  return request("login", { method: "POST" }, payload);
}
