import Annotation from './Annotation';

export default interface Document {
  id: number;
  name: string;
  extension: 'txt' | 'csv' | 'unknown';
  text: string;
  annotations: { [key: number]: Annotation[] };
  updatedAt?: string;
}
