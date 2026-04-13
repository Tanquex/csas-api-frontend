export interface Task {
  id?: number; // Opcional porque al crear una nueva, el ID lo pone la DB
  name: string;
  description: string;
  priority: boolean;
  user_id?: number;
  created_at?: string | Date;
}