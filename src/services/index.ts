import {
  StatusEnum,
  TAppointment,
  TPatient,
  TProfessional,
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

export function findPatients(id: string): Promise<TPatient[]> {
  return request<TPatient[]>(`find-patients/${id}`);
}

export function findProfessionals(id: string): Promise<TProfessional[]> {
  return request<TProfessional[]>(`find-professionals/${id}`);
}

export function createAppointment(
  payload: TAppointment
): Promise<{ success: boolean; data: TAppointment }> {
  return request("create-appointment", { method: "POST" }, payload);
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
}): Promise<{ token: string }> {
  return request("login", { method: "POST" }, payload);
}
