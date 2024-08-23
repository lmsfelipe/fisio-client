// Appointment
export type TAppointment = {
  dateStart: Date;
  dateEnd: Date;
  location: "clinic" | "home";
  patientId: string;
  professionalId: string;
  patientName?: string;
  professionalName?: string;
  observation: string;
};

export interface TAppointmentResponse extends TAppointment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  professionalId: string;
  patientId: string;
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
