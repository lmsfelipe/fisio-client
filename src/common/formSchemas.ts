import { z } from "zod";
import { GenderEnum, IAddress, TPatient, TProfessional } from "@/common/types";

export const addressSchema = z.object({
  street: z.string().min(5),
  number: z.string().min(1),
  neighborhood: z.string().min(5),
  city: z.string().min(5),
  state: z.string().min(5),
  zipCode: z.string().min(9),
}) satisfies z.ZodType<IAddress>;

export const userSchema = z.object({
  name: z.string().min(5),
  email: z.string().email({ message: "E-mail deve ser válido" }),
  birthday: z.string().min(10),
  cpf: z.string().length(14),
  gender: z.enum([GenderEnum.FEMALE, GenderEnum.MALE, GenderEnum.OTHER]),
  phone: z.string().length(15),
  photo: z.optional(z.instanceof(File)),
  address: addressSchema,
});

export const patientSchema = z.object({
  name: z.string().min(5),
  fatherName: z.string(),
  motherName: z.string().min(5),
  diagnosis: z.string().min(3),
}) satisfies z.ZodType<TPatient>;

export const patientPayloadSchema = userSchema.extend({
  patient: patientSchema,
});

const professionalSchema = z.object({
  specialization: z.enum(["phisio", "speech", "secretary"]),
}) satisfies z.ZodType<TProfessional>;

export const professionalPayloadSchema = userSchema.extend({
  professional: professionalSchema,
});
