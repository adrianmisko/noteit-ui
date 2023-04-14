import Tag from './Tag';

export default interface Project {
  id: number;
  name: string;
  tags: Tag[];
  createdAt?: string;
  updatedAt?: string;
}
