import Calendar from "./components/Calendar";
import CreatAppointment from "./components/CreateAppointment";
import { Suspense } from "react";
import UserProfile from "./components/UserProfile";

export default async function Home({
  searchParams,
}: {
  searchParams?: { date?: string };
}) {
  const queryDate = searchParams?.date;

  return (
    <div className="calendar flex">
      <div className="m-6">
        <UserProfile />
        <CreatAppointment />
      </div>

      <Suspense key={queryDate}>
        <Calendar dateQuery={queryDate || undefined} />
      </Suspense>
    </div>
  );
}
