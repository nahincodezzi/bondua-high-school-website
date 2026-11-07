/**
 * Bangladesh Secondary Education Board Grading System
 * Compliant with Board of Intermediate and Secondary Education, Comilla.
 */

export function calculateSubjectGrade(mark, max = 100) {
  const num = Number(mark) || 0;
  const percentage = (num / max) * 100;
  if (percentage >= 80) return { grade: 'A+', point: 5.0 };
  if (percentage >= 70) return { grade: 'A', point: 4.0 };
  if (percentage >= 60) return { grade: 'A-', point: 3.5 };
  if (percentage >= 50) return { grade: 'B', point: 3.0 };
  if (percentage >= 40) return { grade: 'C', point: 2.0 };
  if (percentage >= 33) return { grade: 'D', point: 1.0 };
  return { grade: 'F', point: 0.0 };
}

export function calculateOverallGrade(gpa, hasFail = false) {
  if (hasFail) return 'F';
  const num = Number(gpa);
  if (isNaN(num) || num < 1.0) return 'F';
  if (num >= 5.0) return 'A+';
  if (num >= 4.0) return 'A';
  if (num >= 3.5) return 'A-';
  if (num >= 3.0) return 'B';
  if (num >= 2.0) return 'C';
  if (num >= 1.0) return 'D';
  return 'F';
}
