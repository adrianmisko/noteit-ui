export default interface Chunk {
  start: number;
  end: number;
  innerChunks: Chunk[];
  tagId?: number;
  partOfAnnotation?: boolean;
  parentChunk?: Chunk;
}
