import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <h2 className="text-4xl">
      <Spinner color="default" size="lg" />
    </h2>
  );
}
