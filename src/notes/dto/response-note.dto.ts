export class ResponseNoteDto {
  id: number;
  text: string;
  read: boolean;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
  to: {
    id: number;
    name: string;
  };
  from: {
    id: number;
    name: string;
  };
}
