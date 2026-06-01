export type Exercise = {
  name: string;
  sets?: number;
  reps?: string;
  note?: string;
};

export type WorkoutSection = {
  title: string;
  color: "warm-up" | "main" | "cardio" | "cooldown" | "mobility" | "circuit";
  exercises: Exercise[];
};

export type DayWorkout = {
  day: string;
  shortDay: string;
  title: string;
  subtitle: string;
  type: "upper" | "lower" | "back" | "full-body" | "rest";
  sections: WorkoutSection[];
};

export const WORKOUTS: DayWorkout[] = [
  {
    day: "Monday",
    shortDay: "Mon",
    title: "Upper Body Strength",
    subtitle: "Controlled Cardio",
    type: "upper",
    sections: [
      {
        title: "Warm-Up",
        color: "warm-up",
        exercises: [
          { name: "Shoulder Circles", reps: "1–2 min" },
          { name: "Light Treadmill Walk", reps: "3–5 min" },
        ],
      },
      {
        title: "Strength",
        color: "main",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8–10", note: "~60–70% 1RM" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "12" },
          { name: "Seated Dumbbell Overhead Press", sets: 3, reps: "10" },
          { name: "Assisted Dips or Machine Chest Press", sets: 3, reps: "10" },
        ],
      },
      {
        title: "Cooldown",
        color: "cooldown",
        exercises: [
          { name: "Treadmill Flat Walk", reps: "10 min", note: "HR < 130 bpm" },
        ],
      },
    ],
  },
  {
    day: "Tuesday",
    shortDay: "Tue",
    title: "Lower Body + Core",
    subtitle: "Incline Walk",
    type: "lower",
    sections: [
      {
        title: "Warm-Up",
        color: "warm-up",
        exercises: [
          { name: "Leg Swings", reps: "1–2 min" },
          { name: "Dynamic Stretches", reps: "2–3 min" },
        ],
      },
      {
        title: "Lower Body",
        color: "main",
        exercises: [
          { name: "Goblet Squat or Bodyweight Squat", sets: 3, reps: "12–15" },
          { name: "Leg Press", sets: 3, reps: "12" },
          { name: "Romanian Deadlift", sets: 3, reps: "10" },
        ],
      },
      {
        title: "Core",
        color: "main",
        exercises: [
          { name: "Plank Holds", sets: 3, reps: "30–45 sec" },
          { name: "Bird-Dog", sets: 3, reps: "12 each side" },
        ],
      },
      {
        title: "Cardio Finish",
        color: "cardio",
        exercises: [
          { name: "Incline Walk", reps: "10–15 min", note: "HR ~120–130 bpm" },
        ],
      },
    ],
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    title: "Back + Pull",
    subtitle: "Light Bike",
    type: "back",
    sections: [
      {
        title: "Warm-Up",
        color: "warm-up",
        exercises: [
          { name: "Band Pull-Aparts", reps: "2–3 min" },
          { name: "Light Rowing", reps: "3–5 min" },
        ],
      },
      {
        title: "Pull Strength",
        color: "main",
        exercises: [
          { name: "Lat Pulldown", sets: 4, reps: "12" },
          { name: "Seated Cable Row", sets: 3, reps: "12" },
          { name: "Dumbbell Shrugs", sets: 3, reps: "15" },
          { name: "Assisted Pull-Ups or Machine Row", sets: 3, reps: "8–10" },
        ],
      },
      {
        title: "Bike Cooldown",
        color: "cooldown",
        exercises: [
          { name: "Stationary Bike", reps: "12–15 min", note: "Light resistance · HR ~120–130 bpm" },
        ],
      },
    ],
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    title: "Lower Body + Core",
    subtitle: "Mobility Focus",
    type: "lower",
    sections: [
      {
        title: "Warm-Up",
        color: "warm-up",
        exercises: [
          { name: "Dynamic Lower Body Drills", reps: "3–5 min" },
        ],
      },
      {
        title: "Lower Body",
        color: "main",
        exercises: [
          { name: "Step-Ups (bodyweight or light dumbbells)", sets: 3, reps: "12 per leg" },
          { name: "Glute Bridge", sets: 3, reps: "15" },
          { name: "Seated Leg Curl", sets: 3, reps: "12" },
        ],
      },
      {
        title: "Core",
        color: "main",
        exercises: [
          { name: "Side Plank", sets: 3, reps: "30 sec per side" },
        ],
      },
      {
        title: "Mobility Finish",
        color: "mobility",
        exercises: [
          { name: "Full-Body Stretching Routine", reps: "8–10 min" },
        ],
      },
    ],
  },
  {
    day: "Friday",
    shortDay: "Fri",
    title: "Full Body Circuit",
    subtitle: "Optional Walk",
    type: "full-body",
    sections: [
      {
        title: "Warm-Up",
        color: "warm-up",
        exercises: [
          { name: "Light Rower or Treadmill", reps: "3–4 min" },
        ],
      },
      {
        title: "Circuit",
        color: "circuit",
        exercises: [
          { name: "Dumbbell Bench Press", sets: 3, reps: "10", note: "Rest 60–90 sec between exercises" },
          { name: "Lat Pulldown", sets: 3, reps: "12" },
          { name: "Goblet Squat", sets: 3, reps: "12" },
          { name: "Bird-Dog Core", sets: 3, reps: "15 each side" },
        ],
      },
      {
        title: "Optional Cardio",
        color: "cardio",
        exercises: [
          { name: "Incline Walk", reps: "5–10 min", note: "HR < 130 bpm" },
        ],
      },
    ],
  },
  {
    day: "Saturday",
    shortDay: "Sat",
    title: "Active Recovery",
    subtitle: "Stretch & Mobility",
    type: "rest",
    sections: [
      {
        title: "Stretching & Mobility Routine",
        color: "mobility",
        exercises: [
          { name: "Neck Circles", reps: "1 min each direction" },
          { name: "Cat-Cow Stretch", reps: "1–2 min" },
          { name: "Child's Pose", reps: "Hold 1–2 min" },
          { name: "Chest Opener Stretch", reps: "Hold 1 min" },
          { name: "Seated Forward Fold (Hamstring Stretch)", reps: "Hold 1–2 min" },
          { name: "Hip Flexor Stretch", reps: "1 min per side" },
          { name: "Ankle Circles", reps: "1 min each direction" },
          { name: "Deep Breathing", reps: "1–2 min", note: "Inhale 4 sec · exhale 6 sec" },
        ],
      },
    ],
  },
  {
    day: "Sunday",
    shortDay: "Sun",
    title: "Rest Day",
    subtitle: "Recovery",
    type: "rest",
    sections: [
      {
        title: "Optional Mobility",
        color: "mobility",
        exercises: [
          { name: "Neck Circles", reps: "1 min each direction" },
          { name: "Cat-Cow Stretch", reps: "1–2 min" },
          { name: "Child's Pose", reps: "Hold 1–2 min" },
          { name: "Chest Opener Stretch", reps: "Hold 1 min" },
          { name: "Seated Forward Fold (Hamstring Stretch)", reps: "Hold 1–2 min" },
          { name: "Hip Flexor Stretch", reps: "1 min per side" },
          { name: "Ankle Circles", reps: "1 min each direction" },
          { name: "Deep Breathing", reps: "1–2 min", note: "Inhale 4 sec · exhale 6 sec" },
        ],
      },
    ],
  },
];

// JS getDay() returns 0=Sun,1=Mon,...,6=Sat
// Map to our array index: Mon=0, Tue=1, ..., Sun=6
const JS_DAY_TO_INDEX: Record<number, number> = {
  1: 0, // Monday
  2: 1, // Tuesday
  3: 2, // Wednesday
  4: 3, // Thursday
  5: 4, // Friday
  6: 5, // Saturday
  0: 6, // Sunday
};

export function getTodayIndex(): number {
  return JS_DAY_TO_INDEX[new Date().getDay()];
}
