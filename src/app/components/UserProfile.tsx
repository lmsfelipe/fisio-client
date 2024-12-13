import { findUser } from "@/services";
import { User } from "@nextui-org/react";
import { LogoutButton } from "./LogoutButton";

async function getData() {
  const res = await findUser();

  if (!res?.id) throw new Error("Owner not found");

  return res;
}

export default async function UserProfile() {
  const resp = await getData();

  return (
    <div className="bg-white rounded-3xl bg-opacity-15 px-4 py-2 font-bo relative">
      <User
        name={resp.name}
        description={resp.email}
        classNames={{
          base: "text-white",
          name: "font-bold",
          description: "text-white",
        }}
        avatarProps={{
          name: resp.name.slice(0, 2).toUpperCase(),
          classNames: {
            base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
            icon: "text-black/80",
          },
        }}
      />

      <LogoutButton />
    </div>
  );
}
