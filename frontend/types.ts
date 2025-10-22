
export interface User {
  _id: string;
  name: string;
  mobile: string;
  token: string;
}

export interface Expense {
  _id: string;
  date: string;
  amount: number;
  category: string;
  description?: string;
}

export type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
};

export type ExpenseFormData = Omit<Expense, '_id'>;
