export interface IContactSubmission {
  id?: number;
  full_name: string;
  email: string;
  message: string;
  created_at?: Date;
}