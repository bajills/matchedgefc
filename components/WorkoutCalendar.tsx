"use client";

import { useState } from "react";
import { WORKOUTS, getTodayIndex, type DayWorkout, type WorkoutSection } from "@/lib/workout-data";

const TYPE_BADGE: Record<DayWorkout["type"], string> = {
  upper: "Upper Body",
  lower: "Lower Body",
  back: "Back & Pull",
  "full-body": "Full Body",
  rest: "Recovery",
};

const TYPE_COLOR: Record<DayWorkout["type"], string> = {
  upper: "bg-blue-500/20 text-blue-300",
  lower: "bg-purple-500/20 text-purple-300",
  back: "bg-amber-500/20 text-amber-300",
  "full-body": "bg-edge/20 text-edge",
  rest: "bg-navy-600/60 text-navy-200",
};

const SECTION_ACCENT: Record<WorkoutSection["color"], string> = {
  "warm-up": "border-amber-400/60 bg-amber-400/5",
  main: "border-edge/50 bg-edge/5",
  cardio: "border-sky-400/60 bg-sky-400/5",
  cooldown: "border-blue-400/60 bg-blue-400/5",
  mobility: "border-purple-400/60 bg-purple-400/5",
  circuit: "border-edge/70 bg-edge/10",
};

const SECTION_TITLE_COLOR: Record<WorkoutSection["color"], string> = {
  "warm-up": "text-amber-300",
  main: "text-edge",
  cardio: "text-sky-300",
  cooldown: "text-blue-300",
  mobility: "text-purple-300",
  circuit: "text-edge-glow",
};

const SECTION_DOT: Record<WorkoutSection["color"], string> = {
  "warm-up": "bg-amber-400",
  main: "bg-edge",
  cardio: "bg-sky-400",
  cooldown: "bg-blue-400",
  mobility: "bg-purple-400",
  circuit: "bg-edge-glow",
};

type DayIconProps = { type: DayWorkout["type"] };

function DayIcon({ type }: DayIconProps) {
  const icons: Record<DayWorkout["type"], string> = {
    upper: "💪",
    lower: "🦵",
    back: "🏋️",
    "full-body": "⚡",
    rest: "🌿",
  };
  return <span className="text-lg">{icons[type]}</span>;
}

export function WorkoutCalendar() {
  const todayIndex = getTodayIndex();
  const [selectedIndex, setSelectedIndex] = useState(todayIndex);
  const workout = WORKOUTS[selectedIndex];

  return (
    <div className="space-y-6">
      {/* Week Strip */}
      <div className="grid grid-cols-7 gap-2">
        {WORKOUTS.map((w, i) => {
          const isToday = i === todayIndex;
          const isSelected = i === selectedIndex;
          const isRest = w.type === "rest";
          return (
            <button
              key={w.day}
              onClick={() => setSelectedIndex(i)}
              className={[
                "relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all duration-200",
                isSelected
                  ? "border-edge bg-edge/10 shadow-edge"
                  : isRest
                  ? "border-navy-700 bg-navy-800/40 hover:border-navy-500"
                  : "border-navy-700 bg-navy-800/60 hover:border-edge/40 hover:bg-edge/5",
              ].join(" ")}
            >
              {isToday && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-edge px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-navy-900">
                  Today
                </span>
              )}
              <span
                className={[
                  "text-xs font-semibold uppercase tracking-widest",
                  isSelected ? "text-edge" : "text-navy-300",
                ].join(" ")}
              >
                {w.shortDay}
              </span>
              <DayIcon type={w.type} />
              <span
                className={[
                  "hidden text-[10px] font-medium leading-tight sm:block",
                  isSelected ? "text-white" : "text-navy-400",
                ].join(" ")}
              >
                {w.title.split("+")[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-3xl font-bold text-white">
              {workout.day}
            </h2>
            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                TYPE_COLOR[workout.type],
              ].join(" ")}
            >
              {TYPE_BADGE[workout.type]}
            </span>
          </div>
          <p className="mt-1 text-navy-300">
            <span className="font-semibold text-white">{workout.title}</span>
            {workout.subtitle && (
              <span className="text-navy-400"> · {workout.subtitle}</span>
            )}
          </p>
        </div>
        <DayIcon type={workout.type} />
      </div>

      {/* Workout Sections */}
      {workout.type === "rest" ? (
        <RestDayView workout={workout} />
      ) : (
        <WorkoutView workout={workout} />
      )}
    </div>
  );
}

function WorkoutView({ workout }: { workout: DayWorkout }) {
  return (
    <div className="space-y-4">
      {workout.sections.map((section) => (
        <div
          key={section.title}
          className={[
            "rounded-xl border p-5",
            SECTION_ACCENT[section.color],
          ].join(" ")}
        >
          <div className="mb-4 flex items-center gap-2">
            <span
              className={["h-2 w-2 rounded-full", SECTION_DOT[section.color]].join(" ")}
            />
            <h3
              className={[
                "font-heading text-sm font-bold uppercase tracking-widest",
                SECTION_TITLE_COLOR[section.color],
              ].join(" ")}
            >
              {section.title}
            </h3>
          </div>
          <div className="space-y-2.5">
            {section.exercises.map((ex, i) => (
              <ExerciseRow key={i} exercise={ex} sectionColor={section.color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RestDayView({ workout }: { workout: DayWorkout }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-purple-400/30 bg-purple-400/5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-400" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-purple-300">
            Stretching & Mobility Routine
          </h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {workout.sections[0].exercises.map((ex, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-purple-400/20 bg-navy-800/40 p-3"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-400/20 text-xs font-bold text-purple-300">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{ex.name}</p>
                {ex.reps && (
                  <p className="mt-0.5 text-xs text-purple-300">{ex.reps}</p>
                )}
                {ex.note && (
                  <p className="mt-0.5 text-xs text-navy-400 italic">{ex.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {workout.day === "Sunday" && (
        <div className="rounded-xl border border-navy-700 bg-navy-800/30 p-4 text-center">
          <p className="text-sm text-navy-400">
            Full rest is encouraged.{" "}
            <span className="text-white">Sleep, hydrate, and recover.</span>
          </p>
        </div>
      )}
    </div>
  );
}

function ExerciseRow({
  exercise,
  sectionColor,
}: {
  exercise: { name: string; sets?: number; reps?: string; note?: string };
  sectionColor: WorkoutSection["color"];
}) {
  const isCardio = sectionColor === "cardio" || sectionColor === "cooldown";
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-white/5 bg-navy-900/40 px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium text-white">{exercise.name}</p>
        {exercise.note && (
          <p className="mt-0.5 text-xs text-navy-400 italic">{exercise.note}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 text-right">
        {exercise.sets && !isCardio ? (
          <>
            <span className="rounded bg-navy-700 px-2 py-0.5 text-xs font-mono text-navy-200">
              {exercise.sets}×{exercise.reps}
            </span>
          </>
        ) : (
          <span className="rounded bg-navy-700 px-2 py-0.5 text-xs font-mono text-navy-200">
            {exercise.reps}
          </span>
        )}
      </div>
    </div>
  );
}
