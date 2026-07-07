import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflows } from '../store/slices/workflowSlice';
import WorkflowCard from '../components/WorkflowCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { Filter } from 'lucide-react';
import './WorkflowList.css';

const WorkflowList = () => {
  const dispatch = useDispatch();
  const { workflows, isLoading, error, pagination } = useSelector(state => state.workflows);
  
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchWorkflows({ page, limit: 12, topic, difficulty }));
  }, [dispatch, page, topic, difficulty]);

  const handleFilterChange = (e, type) => {
    setPage(1); // Reset to page 1 on filter change
    if (type === 'topic') setTopic(e.target.value);
    if (type === 'difficulty') setDifficulty(e.target.value);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">CI/CD Workflows</h1>
        <p className="page-subtitle">Explore pre-configured pipelines and infrastructure setups.</p>
      </div>

      <div className="filters-section">
        <div className="filters-header">
          <Filter size={18} />
          <span>Filters</span>
        </div>
        <div className="filters-group">
          <select value={topic} onChange={(e) => handleFilterChange(e, 'topic')} className="filter-select">
            <option value="">All Topics</option>
            <option value="k8s">Kubernetes</option>
            <option value="docker">Docker</option>
            <option value="github-actions">GitHub Actions</option>
            <option value="gitlab-ci">GitLab CI</option>
            <option value="terraform">Terraform</option>
          </select>

          <select value={difficulty} onChange={(e) => handleFilterChange(e, 'difficulty')} className="filter-select">
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="workflow-grid">
            {workflows.length > 0 ? (
              workflows.map(workflow => (
                <WorkflowCard key={workflow._id} workflow={workflow} />
              ))
            ) : (
              <div className="empty-state">No workflows found matching your criteria.</div>
            )}
          </div>

          <Pagination 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            onPageChange={setPage} 
          />
        </>
      )}
    </div>
  );
};

export default WorkflowList;
