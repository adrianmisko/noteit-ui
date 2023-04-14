import Annotation from '../../types/Annotation';
import getNonConflictingAndResolvedAnnotations from '../utils/getConflictlessAnnotations';

describe('getNonConflictingAndResolvedAnnotations', () => {
  it('should count conflicting annotations as conflicting', () => {
    const annotations: { [key: string]: Annotation[] } = {
      'a@a.a': [{ start: 0, end: 20, tagId: 1 }],
      'e@e.e': [{ start: 12, end: 18, tagId: 2 }],
    };
    const chosen: Annotation[] = [];
    const conflictless = getNonConflictingAndResolvedAnnotations(annotations, chosen);
    expect(conflictless).toBeEmpty;
  });
  it('should count non-conflicting annotations as non-conflicting', () => {
    const annotations: { [key: string]: Annotation[] } = {
      'a@a.a': [{ start: 0, end: 20, tagId: 1 }],
      'e@e.e': [{ start: 21, end: 30, tagId: 2 }],
    };
    const chosen: Annotation[] = [];
    const conflictless = getNonConflictingAndResolvedAnnotations(annotations, chosen);
    expect(conflictless).toBeEmpty;
  });
  it('should count conflicting annotation that is resolved as non-conflicting', () => {
    const annotations: { [key: string]: Annotation[] } = {
      'a@a.a': [{ start: 0, end: 20, tagId: 1 }],
      'e@e.e': [{ start: 10, end: 30, tagId: 2 }],
    };
    const chosen: Annotation[] = [{ start: 0, end: 20, tagId: 1 }];
    const conflictless = getNonConflictingAndResolvedAnnotations(annotations, chosen);
    expect(conflictless.length).toBe(1);
    expect(conflictless).toEqual([{ start: 0, end: 20, tagId: 1 }]);
  });
});
