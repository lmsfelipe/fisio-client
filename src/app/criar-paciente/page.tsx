"use client";

import {
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { z } from "zod";
import { PatternFormat } from "react-number-format";
import { parse } from "date-fns";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPatient } from "@/services";
import { GenderEnum, IAddress, TPatient } from "@/common/types";
import { getCookieAction } from "../actions";

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

const patientSchema = z.object({
  name: z.string().min(5),
  fatherName: z.string(),
  motherName: z.string().min(5),
  diagnosis: z.string().min(3),
}) satisfies z.ZodType<TPatient>;

export const patientPayloadSchema = userSchema.extend({
  patient: patientSchema,
});

type TCreatePatientInputs = z.infer<typeof patientPayloadSchema>;

export default function CreatePatient() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }, // TODO: validade errors
  } = useForm<TCreatePatientInputs>({
    resolver: zodResolver(patientPayloadSchema),
    defaultValues: {
      birthday: "",
      cpf: "",
      phone: "",
      address: { zipCode: "" },
    },
  });

  console.log("errors", errors);
  const clearNonNumeric = (str: string) => str.replace(/\D/g, "");

  const onSubmit: SubmitHandler<TCreatePatientInputs> = async (data) => {
    const cookie = await getCookieAction("owner-id");
    const ownerId = cookie?.value;
    console.log("ownerID", ownerId);

    if (!ownerId) {
      console.log("Error getting cookie");
    }

    const formattedPayload = {
      ...data,
      cpf: clearNonNumeric(data.cpf),
      phone: clearNonNumeric(data.phone),
      birthday: parse(data.birthday, "dd/MM/yyyy", new Date()),
      password: "password",
      patient: {
        ...data.patient,
        ownerId,
      },
      address: {
        ...data.address,
        zipCode: clearNonNumeric(data.address.zipCode),
      },
    };

    try {
      await createPatient(formattedPayload);
      toast.success("Paciente criado com sucesso!");
      reset();
    } catch (error) {
      toast.error("Erro! Por favor valide os campos");
      console.log("error", error);
    }
  };

  const rowClasses = "flex gap-x-4 gap-y-3 mb-4";

  return (
    <div className="py-10">
      <h1 className="text-5xl font-bold text-center mb-10 text-white">
        Cadastrar Paciente
      </h1>

      <div className="w-2/3 mx-auto bg-slate-200 rounded-3xl px-10 py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Dados do responsável
          </h2>

          <div className={rowClasses}>
            <Input
              isInvalid={!!errors.name}
              label="Nome"
              {...register("name", { required: true })}
            />

            <Input
              type="email"
              label="E-mail"
              isInvalid={!!errors.email}
              {...register("email")}
            />

            {/* TODO: componentize this */}
            <Controller
              name="birthday"
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <PatternFormat
                  isInvalid={!!errors.birthday}
                  format="##/##/####"
                  customInput={Input}
                  getInputRef={ref}
                  label="Data de nascimento"
                  {...rest}
                />
              )}
            />
          </div>

          <div className={rowClasses}>
            <Controller
              name="cpf"
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <PatternFormat
                  isInvalid={!!errors.cpf}
                  format="###.###.###-##"
                  customInput={Input}
                  getInputRef={ref}
                  label="CPF"
                  {...rest}
                />
              )}
            />

            <Select
              label="Sexo"
              isInvalid={!!errors.gender}
              {...register("gender")}
            >
              <SelectItem key="male">Masculino</SelectItem>
              <SelectItem key="female">Feminino</SelectItem>
            </Select>

            <Controller
              name="phone"
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <PatternFormat
                  isInvalid={!!errors.phone}
                  format="(##) #####-####"
                  customInput={Input}
                  getInputRef={ref}
                  label="Telefone"
                  {...rest}
                />
              )}
            />
          </div>

          <Divider className="my-8" />

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Dados do paciente
          </h2>

          <div className={rowClasses}>
            <Input
              isInvalid={!!errors.patient?.name}
              label="Nome do paciente"
              {...register("patient.name")}
            />
            <Input
              isInvalid={!!errors.patient?.motherName}
              label="Nome da mãe"
              {...register("patient.motherName")}
            />
            <Input label="Nome do Pai" {...register("patient.fatherName")} />
          </div>

          <Textarea
            isInvalid={!!errors.patient?.diagnosis}
            label="Diagnóstico"
            {...register("patient.diagnosis")}
          />

          <Divider className="my-8" />

          <h2 className="text-xl font-bold text-slate-800 mb-6">Endereço</h2>

          <div className={rowClasses}>
            <Input
              isInvalid={!!errors.address?.street}
              label="Endereço"
              {...register("address.street")}
            />
            <Input
              isInvalid={!!errors.address?.number}
              label="Número"
              {...register("address.number")}
            />
            <Input
              isInvalid={!!errors.address?.neighborhood}
              label="Bairro"
              {...register("address.neighborhood")}
            />
          </div>

          <div className={rowClasses}>
            <Input
              isInvalid={!!errors.address?.city}
              label="Cidade"
              {...register("address.city")}
            />
            <Input
              isInvalid={!!errors.address?.state}
              label="Estado"
              {...register("address.state")}
            />

            <Controller
              name="address.zipCode"
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <PatternFormat
                  isInvalid={!!errors.address?.zipCode}
                  format="#####-###"
                  customInput={Input}
                  getInputRef={ref}
                  label="CEP"
                  {...rest}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            color="secondary"
            className="w-full mt-6"
          >
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
