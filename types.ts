
export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  city: string;
  score: number;
  created_at: string;
}

export interface AILog {
  id: string;
  user_id: string;
  type: 'reply' | 'post';
  content: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
}

export interface SOPTask {
  id: string;
  category: 'أساسيات' | 'محتوى' | 'تفاعل' | 'متقدم';
  title: string;
  description: string;
  completed: boolean;
}
