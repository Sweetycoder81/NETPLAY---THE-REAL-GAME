export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface Court {
  _id: string;
  name: string;
  type: string;
  location: string;
  price_per_hour: number;
  amenities: string[];
  available_slots: TimeSlot[];
  image_url?: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface Booking {
  _id: string;
  court_id: string;
  user_id: string;
  date: string;
  time_slot: TimeSlot;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}
