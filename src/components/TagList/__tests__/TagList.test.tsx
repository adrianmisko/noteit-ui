import React from 'react';
import { cleanup, render } from '@testing-library/react';
import TagList from '../TagList';
import Tag from '../../../types/Tag';

describe('TagList', () => {
  beforeEach(cleanup);

  it('Renders without crashing', () => {
    render(<TagList tags={[]} addTag={() => {}} deleteTag={() => {}}  editTagName={() => {}} />);
  });

  it('Renders all tags', () => {
    const tags: Tag[] = [{ id: 1, color: 'red', name: 'tag 1' }, { id: 2, color: 'blue', name: 'tag 2' }];

    const { getByText } = render(<TagList tags={tags} addTag={() => {}} deleteTag={() => {}}  editTagName={() => {}} />);

    expect(getByText('tag 1')).toBeDefined();
    expect(getByText('tag 2')).toBeDefined();
  });

  it('Renders the first letter uppercase', () => {
    const tags: Tag[] = [{ id: 1, color: 'red', name: 'tag 1' }];

    const { getByText } = render(<TagList tags={tags} addTag={() => {}} deleteTag={() => {}}  editTagName={() => {}} />);

    expect(getByText('T')).toBeDefined();
  });
});
