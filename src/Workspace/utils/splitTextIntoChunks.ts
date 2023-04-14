import Annotation from '../../types/Annotation';
import findAnnotatedTokens from './findAnnotatedTokens';
import Chunk from '../../types/Chunk';

export const findAll = ({
  findChunks = findAnnotatedTokens,
  annotations,
  textToHighlight,
}: {
  findChunks?: (annotations: Annotation[]) => Chunk[];
  annotations: Annotation[];
  textToHighlight: string;
}): Chunk[] =>
  fillInChunks({
    chunksToHighlight: findChunks(annotations),
    totalLength: textToHighlight ? textToHighlight.length : 0,
  });

export const fillInChunks = ({
  chunksToHighlight,
  totalLength,
}: {
  chunksToHighlight: Chunk[];
  totalLength: number;
}): Chunk[] => {
  const allChunks: Chunk[] = [];

  const append = (start: number, end: number) => {
    if (end - start > 0) {
      allChunks.push({
        start,
        end,
        innerChunks: [],
      });
    }
  };

  const findLeftMostChunkStart = (chunk: Chunk): number => {
    const thisLevelStarts = chunk.innerChunks.map((c: Chunk) => findLeftMostChunkStart(c));
    return Math.min(...thisLevelStarts, chunk.start);
  };

  if (chunksToHighlight.length === 0) {
    append(0, totalLength);
  } else {
    let lastIndex = 0;
    chunksToHighlight.forEach(chunk => {
      const start = findLeftMostChunkStart(chunk);
      append(lastIndex, start);
      allChunks.push(chunk);
      // eslint-disable-next-line prefer-destructuring
      lastIndex = chunk.end;
    });
    append(lastIndex, totalLength);
  }
  return allChunks;
};
