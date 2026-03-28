export type PickRow = {
  id: string;
  competition: string;
  match_name: string;
  bet_type: string;
  odds_display: string;
  /** American odds at publish time; compare to odds_display for movement */
  opening_odds?: string | null;
  sportsbook: string;
  kickoff_at: string;
  sport: string;
  sort_order?: number;
  reasoning?: string | null;
  result?: string | null;
  /** e.g. "2-1" after grading */
  final_score?: string | null;
  /** 1–3, higher = stronger conviction */
  confidence?: number | null;
  is_free?: boolean | null;
};

export type SportRecordRow = {
  id: string;
  sport_key: string;
  label: string;
  wins: number;
  losses: number;
};
