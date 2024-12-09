"use client";

import { Button, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import { toast } from "react-toastify";
import { z } from "zod";
import { parse } from "date-fns";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createProfessional } from "@/services";
import { getCookieAction } from "../actions";
import { InputNumberMask } from "../components/InputNumberMask";
import { professionalPayloadSchema } from "@/common/formSchemas";

type TCreateProfessionalInputs = z.infer<typeof professionalPayloadSchema>;

export default function CreatePatient() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }, // TODO: validade errors
  } = useForm<TCreateProfessionalInputs>({
    resolver: zodResolver(professionalPayloadSchema),
    defaultValues: {
      birthday: "",
      cpf: "",
      phone: "",
      address: { zipCode: "" },
    },
  });

  const clearNonNumeric = (str: string) => str.replace(/\D/g, "");

  const onSubmit: SubmitHandler<TCreateProfessionalInputs> = async (data) => {
    const cookie = await getCookieAction("owner-id");
    const ownerId = cookie?.value;

    if (!ownerId) {
      return toast.error("Erro ao receber ownerId");
    }

    const formattedPayload = {
      ...data,
      cpf: clearNonNumeric(data.cpf),
      phone: clearNonNumeric(data.phone),
      birthday: parse(data.birthday, "dd/MM/yyyy", new Date()),
      password: "password",
      professional: {
        ...data.professional,
        ownerId,
      },
      address: {
        ...data.address,
        zipCode: clearNonNumeric(data.address.zipCode),
      },
    };

    try {
      await createProfessional(formattedPayload);
      toast.success("Profissional criado com sucesso!");
      reset();
    } catch (error) {
      toast.error("Erro! Por favor valide os campos");
      console.log("error", error);
    }
  };

  const rowClasses = "flex gap-x-4 gap-y-3 mb-4";
  console.log("errors", errors);
  return (
    <div className="py-10">
      <h1 className="text-5xl font-bold text-center mb-10 text-white">
        Cadastrar Profissional
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

            <InputNumberMask
              control={control}
              hasError={!!errors.birthday}
              inputName="birthday"
              label="Data de nascimento"
              mask="##/##/####"
            />
          </div>

          <div className={rowClasses}>
            <InputNumberMask
              control={control}
              hasError={!!errors.cpf}
              inputName="cpf"
              label="CPF"
              mask="###.###.###-##"
            />

            <Select
              label="Sexo"
              isInvalid={!!errors.gender}
              {...register("gender")}
            >
              <SelectItem key="male">Masculino</SelectItem>
              <SelectItem key="female">Feminino</SelectItem>
            </Select>

            <InputNumberMask
              control={control}
              hasError={!!errors.phone}
              inputName="phone"
              label="Telefone"
              mask="(##) #####-####"
            />
          </div>

          <Divider className="my-8" />

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Dados do profissional
          </h2>

          <div className={rowClasses}>
            <Input
              isInvalid={!!errors.professional?.name}
              label="Nome do profissional"
              {...register("professional.name")}
            />

            <Select
              label="Especialização"
              isInvalid={!!errors.professional?.specialization}
              {...register("professional.specialization")}
            >
              <SelectItem key="phisio">Fisioterapia</SelectItem>
              <SelectItem key="speech">Fonoaudiolodia</SelectItem>
              <SelectItem key="secretary">Secretária/o</SelectItem>
            </Select>
          </div>

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

            <InputNumberMask
              control={control}
              hasError={!!errors.address?.zipCode}
              inputName="address.zipCode"
              label="CEP"
              mask="#####-###"
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
