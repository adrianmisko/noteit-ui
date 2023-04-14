import { groupBy, isEqual } from 'lodash';
// @ts-ignore
import BronKerbosch from 'almete.bronkerbosch';
import Annotation from '../../types/Annotation';
import { Conflict, ConflictingAnnotation, UserAnnotation } from '../ReviewModel';

export const isNotInAnyClique = (idx: number, cliques: number[][]): boolean => {
  let isNot = true;
  cliques.forEach(clique => {
    if (clique.includes(idx)) {
      isNot = false;
    }
  });
  return isNot;
};

export const annotationsAreExact = (conflicts: ConflictingAnnotation[]) => {
  const annotations = conflicts.map(c => c.annotations);
  const referenceAnnotation = annotations[0];
  return annotations.every(annotation => isEqual(referenceAnnotation, annotation));
};

export const calculateConflicts = (annotations: { [key: string]: Annotation[] }): Conflict[] => {
  const result: Conflict[] = [];
  const userAnnotations: UserAnnotation[] = [];
  Object.keys(annotations).forEach(user => {
    annotations[user].forEach(annotation => {
      userAnnotations.push({ user, annotation });
    });
  });
  const users = Object.keys(annotations).sort((a, b) => a.localeCompare(b));
  const edges: [number, number][] = [];
  userAnnotations.forEach((annotation0, i) => {
    userAnnotations.forEach((annotation1, j) => {
      if (
        i === j ||
        edges.find(edge => edge[0] === i && edge[1] === j) ||
        edges.find(edge => edge[0] === j && edge[1] === i)
      ) {
      } else if (
        annotation0.annotation.start <= annotation1.annotation.end &&
        annotation1.annotation.start <= annotation0.annotation.end
      ) {
        edges.push([i, j]);
      }
    });
  });
  const cliques: number[][] = BronKerbosch(edges);
  const cliqueless = userAnnotations.map((_, idx) => idx).filter(idx => isNotInAnyClique(idx, cliques));
  cliques.forEach((clique, id) => {
    const grouped = clique.map(idx => userAnnotations[idx]);
    const groupedByUser = groupBy(grouped, 'user');
    const conflicts: ConflictingAnnotation[] = Object.keys(groupedByUser).map(user => ({
      user,
      annotations: groupedByUser[user].map(userAnnotation => userAnnotation.annotation),
    }));
    const conflictsUsers = conflicts.map(c => c.user).sort((a, b) => a.localeCompare(b));
    if (isEqual(conflictsUsers, users)) {
      if (!annotationsAreExact(conflicts)) {
        result.push({ id, conflicts });
      }
    } else {
      const nonIncludedUsers = users.filter(u => !conflictsUsers.includes(u));
      nonIncludedUsers.forEach(user => {
        conflicts.push({ user, annotations: [] });
      });
      result.push({ id, conflicts });
    }
  });
  cliqueless.forEach(idx => {
    const { user, annotation } = userAnnotations[idx];
    const restOfUsers = Object.keys(annotations).filter(u => u !== user);
    const conflicts: ConflictingAnnotation[] = [
      { user, annotations: [annotation] },
      ...restOfUsers.map(u => ({ user: u, annotations: [] })),
    ];
    result.push({ id: result.length, conflicts });
  });
  return result;
};

export default calculateConflicts;
