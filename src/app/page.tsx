import CalendarContent from "./components/CalendarContent";
import CreatAppointment from "./components/CreateAppointment";
// import { Suspense } from "react";
import UserProfile from "./components/UserProfile";

export default async function Home({
  searchParams,
}: {
  searchParams?: { date?: string };
}) {
  const queryDate = searchParams?.date;

  return (
    <div className="calendar flex">
      <div className="m-4">
        <UserProfile />
        <CreatAppointment />
      </div>

      <CalendarContent dateQuery={queryDate || undefined} />
      {/* <Suspense key={queryDate}>
      </Suspense> */}
    </div>
  );
}
