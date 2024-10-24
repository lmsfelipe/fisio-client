/* eslint-disable no-unused-vars */
export type TUser = {
  id?: string;
  name: string;
  email: string;
  password: string;
  birthday: Date;
  cpf: string;
  gender: "male" | "female" | "other";
  phone: string;
  photo?: File;
  userType?: "patient" | "professional" | "owner";
  permission?: "view" | "edit" | "full";
};

// Appointment
export enum StatusEnum {
  OPENED = "opened",
  CLOSED = "closed",
  MISSED = "missed",
}

export type TAppointment = {
  dateStart: string;
  dateEnd: string;
  location: "clinic" | "home";
  patientId: string;
  professionalId: string;
  patientName?: string;
  professionalName?: string;
  observation: string;
  status?: StatusEnum; // TODO: It should be required
};

export type TSmallAppt = {
  dateStart: string;
  professionalId: string;
};

export interface TAppointmentResponse extends TAppointment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  professionalId: string;
  patientId: string;
}

export interface TAppointmentQuery extends TAppointmentResponse {
  isEdit: boolean;
}

// Patient
export type TPatient = {
  id: string;
  ownerId: string;
  name: string;
  motherName: string;
  fatherName: string;
  diagnosis: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

// Professional
export type TProfessional = {
  id: string;
  name: string;
  ownerId: string;
  specialization: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export interface TProfessionalWithAppoitments extends TProfessional {
  appointments: TAppointmentResponse[];
}

// Error
export interface TError {
  statusCode: number;
  error: string;
  issues: Issue[];
}

export interface Issue {
  received: string;
  code: string;
  options: string[];
  path: string[];
  message: string;
}
