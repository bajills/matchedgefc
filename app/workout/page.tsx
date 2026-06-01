import { Header } from "@/components/Header";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";

export const metadata = {
  title: "My Workout Plan | MatchEdge FC",
  description: "Personalized weekly workout calendar — strength, cardio, and mobility.",
};

export default function WorkoutPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 pb-20">
        {/* Page Title */}
        <div className="mb-8">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-edge">
            Personal Training
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Weekly Workout Plan
          </h1>
          <p className="mt-3 max-w-lg text-navy-300">
            Your personalized 5-day strength program with controlled cardio and mobility
            built in. Click any day to see your full session.
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { label: "Warm-Up", dot: "bg-amber-400" },
            { label: "Strength / Main", dot: "bg-edge" },
            { label: "Cardio", dot: "bg-sky-400" },
            { label: "Cooldown", dot: "bg-blue-400" },
            { label: "Mobility", dot: "bg-purple-400" },
            { label: "Circuit", dot: "bg-edge-glow" },
          ].map(({ label, dot }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-800/50 px-3 py-1 text-xs text-navy-300"
            >
              <span className={["h-2 w-2 rounded-full", dot].join(" ")} />
              {label}
            </div>
          ))}
        </div>

        {/* Calendar */}
        <WorkoutCalendar />

        {/* Sticky Mobility Reminder */}
        <div className="mt-12 rounded-2xl border border-purple-400/30 bg-purple-400/5 p-6">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-purple-300">
            Stretching & Mobility Reminder
          </h2>
          <p className="mt-2 text-sm text-navy-300">
            This routine is also suitable{" "}
            <span className="text-white font-medium">after work on any training day</span>{" "}
            or as a standalone session on rest days. Consistency with this routine improves
            recovery, posture, and injury prevention.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {[
              "Neck Circles",
              "Cat-Cow",
              "Child's Pose",
              "Chest Opener",
              "Forward Fold",
              "Hip Flexor",
              "Ankle Circles",
              "Deep Breathing",
            ].map((name) => (
              <div
                key={name}
                className="rounded-lg border border-purple-400/20 bg-navy-800/40 px-3 py-2 text-xs text-navy-200"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
