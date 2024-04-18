export type StudentTypes = {
  student_id: number;
  student_name: string;
  student_id_code: string;
  student_profile: string;
  created_at: string;
};

export type EventTypes = {
  event_id: number;
  event_title: string;
  event_type: string;
  event_date: string;
  created_at: string;
};

export type EventRecordsType = {
  event_title: string;
  student_name: string;
  student_profile: string;
  event_records_id: number;
  event_id: string;
  amount: number;
  student_code_id: string;
  created_at: string;
  payment_type: string;
  phone_number: string;
  proof_image: string;
  reference_no: string;
  payment_status: string;
};
