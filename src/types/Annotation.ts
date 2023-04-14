export default interface Annotation {
  start: number;
  end: number;
  tagId: number;
  isFinal?: boolean;
}
