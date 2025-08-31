export type Workout = {
  id: number;
  name: string;
  description: string;
  duration: number;
  intensity: string;
};

export type Plan = {
  id: number;
  trainer: string;
  name: string;
  description: string;
  price: string;
  is_active: boolean;
  workouts: Workout[];
  subscriptions: Subscription[];
};

export type Subscription = {
  id: number;
  athlete: string;
  athlete_id: number;
  plan: Plan;
  start_date: string;
  end_date: string;
  active: boolean;
};
