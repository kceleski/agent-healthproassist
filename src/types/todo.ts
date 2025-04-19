
export interface TodoItem {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  related_client_id?: string;
  related_facility_id?: string;
  related_appointment_id?: string;
  ai_generated?: boolean;
  tags?: string[];
  created_at?: string;
}
