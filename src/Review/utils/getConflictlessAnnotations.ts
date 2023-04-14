import { groupBy, isEqual } from 'lodash';
// @ts-ignore
import BronKerbosch from 'almete.bronkerbosch';
import Annotation from '../../types/Annotation';
import { ConflictingAnnotation, UserAnnotation } from '../ReviewModel';
import { annotationsAreExact, isNotInAnyClique } from './calculateConflicts';

const getConflictlessAndChosenAnnotations = (
  annotations: { [key: string]: Annotation[] },
  chosenAnnotations: Annotation[],
): Annotation[] => {
  const result: Annotation[] = [];
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
  cliques.forEach(clique => {
    const grouped = clique.map(idx => userAnnotations[idx]);
    const groupedByUser = groupBy(grouped, 'user');
    const conflicts: ConflictingAnnotation[] = Object.keys(groupedByUser).map(user => ({
      user,
      annotations: groupedByUser[user].map(userAnnotation => userAnnotation.annotation),
    }));
    const conflictsUsers = conflicts.map(c => c.user).sort((a, b) => a.localeCompare(b));
    if (isEqual(conflictsUsers, users)) {
      if (annotationsAreExact(conflicts)) {
        result.push(...conflicts.flatMap(c => c.annotations));
      }
    } else {
      const nonIncludedUsers = users.filter(u => !conflictsUsers.includes(u));
      nonIncludedUsers.forEach(user => {
        conflicts.push({ user, annotations: [] });
      });
    }
    conflicts.forEach(c => {
      c.annotations.forEach(a => {
        if (chosenAnnotations.find(ann => ann.start === a.start && ann.end === a.end && a.tagId === ann.tagId)) {
          result.push(a);
        }
      });
    });
  });
  const cliqueless = userAnnotations.map((_, idx) => idx).filter(idx => isNotInAnyClique(idx, cliques));
  cliqueless.forEach(idx => {
    const { annotation } = userAnnotations[idx];
    if (
      chosenAnnotations.find(
        ann => ann.start === annotation.start && ann.end === annotation.end && annotation.tagId === ann.tagId,
      )
    ) {
      result.push(annotation);
    }
  });
  return result;
};

export default getConflictlessAndChosenAnnotations;
