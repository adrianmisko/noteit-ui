import Annotation from '../../types/Annotation';
import Chunk from '../../types/Chunk';

export const sortByStartAndLength = (a: Annotation, b: Annotation) => {
  const order = a.start - b.start;
  if (order === 0) {
    return b.end - b.start - (a.end - a.start);
  }
  return order;
};

const findOverlappingChunk = (chunks_: Chunk[], chunk: Chunk): Chunk | undefined => {
  const overlappingOnThisLevel = chunks_.find(ch => chunk.start < ch.end);
  let overlappingBelow;
  if (overlappingOnThisLevel) {
    overlappingBelow = findOverlappingChunk(overlappingOnThisLevel.innerChunks, chunk);
  }
  return overlappingBelow || overlappingOnThisLevel;
};

const addAnnotationAsAChunkAndSplitIfNecessary = (chunks: Chunk[], wouldBeEntireChunk: Chunk): void => {
  const overlappingChunk = findOverlappingChunk(chunks, wouldBeEntireChunk);
  if (overlappingChunk) {
    // entire annotation contained withing a chunk
    if (overlappingChunk.end >= wouldBeEntireChunk.end) {
      // split by inner chunk
      const spaceBefore = wouldBeEntireChunk.start - overlappingChunk.start;
      const spaceAfter = overlappingChunk.end - wouldBeEntireChunk.end;
      if (spaceBefore) {
        overlappingChunk.innerChunks.push({
          start: overlappingChunk.start,
          end: wouldBeEntireChunk.start,
          innerChunks: [],
          parentChunk: overlappingChunk,
        });
      }
      overlappingChunk.innerChunks.push({
        start: wouldBeEntireChunk.start,
        end: wouldBeEntireChunk.end,
        tagId: wouldBeEntireChunk.tagId,
        innerChunks: [],
        parentChunk: overlappingChunk,
        partOfAnnotation: wouldBeEntireChunk.partOfAnnotation,
      });
      if (spaceAfter) {
        overlappingChunk.innerChunks.push({
          start: wouldBeEntireChunk.end,
          end: overlappingChunk.end,
          innerChunks: [],
          parentChunk: overlappingChunk,
        });
      }
    } else {
      // annotations partially overlap
      const partOne = {
        start: wouldBeEntireChunk.start,
        end: overlappingChunk.end,
        tagId: wouldBeEntireChunk.tagId,
        innerChunks: [],
        partOfAnnotation: true,
      };
      const partTwo = {
        start: overlappingChunk.end,
        end: wouldBeEntireChunk.end,
        tagId: wouldBeEntireChunk.tagId,
        innerChunks: [],
      };
      addAnnotationAsAChunkAndSplitIfNecessary(chunks, partOne);
      addAnnotationAsAChunkAndSplitIfNecessary(chunks, partTwo);
    }
  } else {
    chunks.push(wouldBeEntireChunk);
  }
};

export default function(annotations: Annotation[]): Chunk[] {
  const chunks: Chunk[] = [];

  annotations
    .sort((a, b) => sortByStartAndLength(a, b))
    .forEach(annotation => {
      const wouldBeEntireChunk: Chunk = {
        start: annotation.start,
        end: annotation.end,
        tagId: annotation.tagId,
        innerChunks: [],
      };
      addAnnotationAsAChunkAndSplitIfNecessary(chunks, wouldBeEntireChunk);
    });

  return chunks;
}
