/* eslint-disable no-unused-vars */
export enum UserTypeEnum {
  PATIENT = "patient",
  PROFESSIONAL = "professional",
  OWNER = "owner",
}

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum PermissionEnum {
  VIEW = "view",
  EDIT = "edit",
  FULL = "full",
}

export type TUser = {
  id?: string;
  companyId?: string;
  name: string;
  email: string;
  password: string;
  birthday: Date;
  cpf: string;
  gender: GenderEnum;
  phone: string;
  photo?: File;
  userType?: UserTypeEnum;
  permission?: PermissionEnum;
};

// Address
export interface IAddress {
  companyId?: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// Appointment
export enum StatusEnum {
  OPENED = "opened",
  CLOSED = "closed",
  MISSED = "missed",
}

export type TAppointment = {
  companyId?: string;
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
  companyId?: string;
  name: string;
  motherName: string;
  fatherName?: string;
  diagnosis: string;
};

export type TPatientResponse = TPatient & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type TPatientPayload = TUser & {
  patient: TPatient;
};

// Professional
export interface TProfessional {
  companyId?: string;
  name?: string;
  specialization: "phisio" | "speech" | "secretary";
}

export type TProfessionalResponse = {
  id: string;
  name: string;
  companyId: string;
  specialization: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export interface TProfessionalWithAppoitments extends TProfessionalResponse {
  appointments: TAppointmentResponse[];
}

export type TProfessionalPayload = TUser & {
  professional: TProfessional;
};

// Company
export type TCompany = {
  id: string;
  companyName: string;
  cnpj: string;
  logo: File;
};

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
