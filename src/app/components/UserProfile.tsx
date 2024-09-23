import { findUser } from "@/services";
import { User } from "@nextui-org/react";

async function getData() {
  const res = await findUser();
  console.log("res", res);

  if (!res?.id) throw new Error("Owner not found");

  return res;
}

export default async function UserProfile() {
  const resp = await getData();

  return (
    <div className="bg-white rounded-3xl bg-opacity-15 p-4 font-bo">
      <User
        name={resp.name}
        description={resp.email}
        classNames={{
          base: "text-white",
          name: "font-bold",
          description: "text-white",
        }}
        avatarProps={{
          name: resp.name,
          classNames: {
            base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
            icon: "text-black/80",
          },
        }}
      />
    </div>
  );
}
