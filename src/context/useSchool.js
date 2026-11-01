import { useContext } from 'react';
import { SchoolContext } from './SchoolContextInstance';

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
