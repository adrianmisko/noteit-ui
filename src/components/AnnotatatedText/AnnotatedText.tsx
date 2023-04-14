/* eslint-disable */
import React, { FC } from 'react';
import Tag from '../../types/Tag';
import Chunk from '../../types/Chunk';
// @ts-ignore
import xolor from 'xolor';

interface AnnotatedTextProps {
  tags: Tag[];
  chunks: Chunk[];
  text: string;
  level: number;
}

const BackgroudReset: FC = ({ children }) => (
  <span style={{
    backgroundColor: 'white',
  }}>
    {children}
  </span>
);

const containsPartOfAnnotation = (chunk: Chunk): boolean => {
  let contains = false;
  for (const ch of chunk.innerChunks) {
    if (ch.partOfAnnotation) {
      contains = true;
    } else if (!contains) {
      contains = containsPartOfAnnotation(ch);
    }
  }
  return contains;
};

const isTopLevelChunk = (chunk: Chunk): boolean => !chunk.parentChunk;

const theSameColorNoAlpha = (color: string) => {
  const { r, g, b } = xolor(color);
  return `rgb(${r}, ${g}, ${b})`;
};


const AnnotatedText: FC<AnnotatedTextProps> = ({ chunks, tags, text, level }: AnnotatedTextProps) => (
  <>
    {chunks.map((chunk: Chunk) => {
      // TODO? store token in the chunk or have it as a computed property
      const token = chunk.innerChunks.length ? '' : text.substr(chunk.start, chunk.end - chunk.start);
      const tag = tags.find(tag => tag.id === chunk.tagId)!!;
      const key = `${chunk.start}-${chunk.end}-${token}-${tag ? tag.id : ''}`;

      const backgroundColor = tag ? tag.color : 'transparent';
      const paddingTopAndBottom = chunk.parentChunk && !chunk.partOfAnnotation ? 0 : 2;
      const paddingLeft = !containsPartOfAnnotation(chunk) && isTopLevelChunk(chunk) ? 2 : 0;
      const padding = `${paddingTopAndBottom}px ${paddingLeft}px ${paddingTopAndBottom}px 1px`;
      const tagColorNoAlpha = theSameColorNoAlpha(backgroundColor);
      const boxShadow = containsPartOfAnnotation(chunk) && isTopLevelChunk(chunk) ? `1px 0px 7px 1px ${tagColorNoAlpha}` : 'none';

      const tagStyle = { backgroundColor, padding, boxShadow };

      const chunkWithColor =
        // TODO on long hover hide all others annotations or show tooltip if there are more that two annotations for the same selection
        <span style={tagStyle}>
          {chunk.innerChunks.length ?
            <AnnotatedText
              chunks={chunk.innerChunks}
              text={text}
              tags={tags}
              level={chunk.tagId ? level + 1 : level}
            /> : token.split('\n').map((t, i) => i ? [<br/>, t] : t)}
        </span>;

      return chunk.tagId ?
        <BackgroudReset key={key}>
          {chunkWithColor}
        </BackgroudReset>
        :
        chunkWithColor
    })}
  </>
);

export default AnnotatedText;
