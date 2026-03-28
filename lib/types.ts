export type PickRow = {
  id: string;
  competition: string;
  match_name: string;
  bet_type: string;
  odds_display: string;
  sportsbook: string;
  kickoff_at: string;
  sport: string;
  sort_order?: number;
};

export type SportRecordRow = {
  id: string;
  sport_key: string;
  label: string;
  wins: number;
  losses: number;
};
