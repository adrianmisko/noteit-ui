import Annotation from '../../types/Annotation';
import { calculateConflicts } from '../utils/calculateConflicts';
import { Conflict } from '../ReviewModel';

describe('calculateConflicts', () => {
  it('should not count the same annotations as conflicting', () => {
    const annotations: { [key: string]: Annotation[] } = {
      'a@a.a': [{ start: 0, end: 20, tagId: 1 }],
      'e@e.e': [{ start: 0, end: 20, tagId: 1 }],
    };
    const conflicts: Conflict[] = calculateConflicts(annotations);
    expect(conflicts).toBeEmpty;
  });
  it('should count annotation as conflicting when one user does not annotate a phrase', () => {
    const annotations: { [key: string]: Annotation[] } = {
      'a@a.a': [{ start: 0, end: 20, tagId: 1 }],
      'e@e.e': [{ start: 10, end: 20, tagId: 1 }],
    };
    const conflicts: Conflict[] = calculateConflicts(annotations);
    expect(conflicts.length).toBe(1);
    expect(conflicts).toStrictEqual([
      {
        id: 0,
        conflicts: [
          { user: 'a@a.a', annotations: [{ start: 0, end: 20, tagId: 1 }] },
          { user: 'e@e.e', annotations: [{ start: 10, end: 20, tagId: 1 }] },
        ],
      },
    ]);
  });
  it('should count non-intersecting annotations two conflicts', () => {
    const annotations: { [key: string]: Annotation[] } = {
      'a@a.a': [{ start: 0, end: 20, tagId: 1 }],
      'e@e.e': [{ start: 21, end: 30, tagId: 2 }],
    };
    const conflicts: Conflict[] = calculateConflicts(annotations);
    expect(conflicts.length).toBe(2);
    expect(conflicts).toEqual([
      {
        id: 0,
        conflicts: [
          { user: 'a@a.a', annotations: [{ start: 0, end: 20, tagId: 1 }] },
          { user: 'e@e.e', annotations: [] },
        ],
      },
      {
        id: 1,
        conflicts: [
          { user: 'e@e.e', annotations: [{ start: 21, end: 30, tagId: 2 }] },
          { user: 'a@a.a', annotations: [] },
        ],
      },
    ]);
  });
  it('should count intersecting annotations as conflicts', () => {
    const annotations: { [key: string]: Annotation[] } = {
      'a@a.a': [{ start: 0, end: 20, tagId: 1 }],
      'e@e.e': [{ start: 10, end: 30, tagId: 1 }],
    };
    const conflicts: Conflict[] = calculateConflicts(annotations);
    expect(conflicts.length).toBe(1);
    expect(conflicts).toStrictEqual([
      {
        id: 0,
        conflicts: [
          { user: 'a@a.a', annotations: [{ start: 0, end: 20, tagId: 1 }] },
          { user: 'e@e.e', annotations: [{ start: 10, end: 30, tagId: 1 }] },
        ],
      },
    ]);
  });
  it('should count intersecting annotations as conflicts and group them accordingly', () => {
    const annotations: { [key: string]: Annotation[] } = {
      'a@a.a': [{ start: 0, end: 20, tagId: 1 }, { start: 10, end: 30, tagId: 2 }],
      'e@e.e': [{ start: 12, end: 18, tagId: 2 }],
    };
    const conflicts: Conflict[] = calculateConflicts(annotations);
    expect(conflicts.length).toBe(1);
    expect(conflicts).toStrictEqual([
      {
        id: 0,
        conflicts: [
          { user: 'a@a.a', annotations: [{ start: 0, end: 20, tagId: 1 }, { start: 10, end: 30, tagId: 2 }] },
          { user: 'e@e.e', annotations: [{ start: 12, end: 18, tagId: 2 }] },
        ],
      },
    ]);
  });
});
