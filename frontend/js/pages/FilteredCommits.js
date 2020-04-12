import React from 'react';
import { useParams } from 'react-router-dom';

const FilteredCommits = () => {
  const { project } = useParams();

  return (
    <div>
      <p>FilteredCommits of {project}</p>
    </div>
  );
};

export default FilteredCommits;
