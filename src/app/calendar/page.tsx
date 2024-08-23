import Link from "next/link";
import Calendar from "./components/Calendar";
import CreatAppointment from "./components/CreateAppointment";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams?: { date?: string };
}) {
  const queryDate = searchParams?.date;

  return (
    <div className="calendar">
      <CreatAppointment />

      <Suspense key={queryDate}>
        <Calendar dateQuery={queryDate || null} />
      </Suspense>
    </div>
  );
}
