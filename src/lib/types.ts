export type MessageChannel = "whatsapp" | "instagram" | "telefon";

export type AppointmentStatus = "confirmed" | "pending" | "cancelled" | "done";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  notes: string;
  lastVisit: string;
  balanceAzn: number;
  tags: string[];
};

export type Appointment = {
  id: string;
  customerId: string;
  service: string;
  date: string;
  time: string;
  durationMin: number;
  status: AppointmentStatus;
  priceAzn: number;
};

export type InboxMessage = {
  id: string;
  customerId: string;
  channel: MessageChannel;
  text: string;
  at: string;
  unread: boolean;
  direction: "in" | "out";
};

export type Business = {
  name: string;
  owner: string;
  category: string;
  city: string;
  address: string;
  phone: string;
};

export type AppState = {
  business: Business;
  customers: Customer[];
  appointments: Appointment[];
  messages: InboxMessage[];
};

export type AiAction =
  | { type: "mark_read"; messageId: string }
  | { type: "reply"; customerId: string; text: string }
  | { type: "confirm"; appointmentId: string };

export type AiResult = {
  reply: string;
  actions?: AiAction[];
};
