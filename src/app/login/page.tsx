"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Button, Input } from "@nextui-org/react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services";

import { setCookieAction } from "../actions";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type TLoginInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }, // TODO: validade errors
  } = useForm<TLoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<TLoginInputs> = async (data) => {
    try {
      const resp = await login(data);
      setCookieAction("jwt-token", resp.token);
      router.push("/");
    } catch (error) {
      // TODO: validade errors
      console.log("error", error);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-1/3 bg-slate-200 rounded-3xl px-10 py-10">
        <h2 className="text-3xl font-bold text-center mb-5">Acessar a conta</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="mb-2"
            type="email"
            label="E-mail"
            placeholder="Qual seu e-mail?"
            {...register("email")}
          />

          <Input
            className="mb-5"
            label="Senha"
            placeholder="Digite sua senha"
            {...register("password")}
            endContent={
              <button
                className="focus:outline-none h-6 w-6"
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <Button type="submit" size="lg" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
