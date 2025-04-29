
export interface RoundStop {
  id: string;
  patient: {
    name: string;
    address: string;
  };
  time: string;
  care: string;
  completed: boolean;
}

export interface Round {
  id: string;
  name: string;
  date: string;
  stops: RoundStop[];
  completed: boolean;
  started: boolean;
}
