export class ResponseNoteDto {
  id: number;
  text: string;
  read: boolean;
  data: string;
  createdAt?: string;
  updatedAt?: string;
  to: {
    id: string;
    name: string;
  };
  from: {
    id: string;
    name: string;
  };
}
