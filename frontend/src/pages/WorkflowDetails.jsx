import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflowById, clearCurrentWorkflow } from '../store/slices/workflowSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Clock, Activity, Tag, Play } from 'lucide-react';
import './WorkflowDetails.css';

const WorkflowDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentWorkflow: workflow, isLoading, error } = useSelector(state => state.workflows);

  useEffect(() => {
    dispatch(fetchWorkflowById(id));
    return () => {
      dispatch(clearCurrentWorkflow());
    };
  }, [dispatch, id]);

  if (isLoading || !workflow) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <div className="page-container text-center mt-10">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/workflows')} className="search-btn mt-4">Go Back</button>
      </div>
    );
  }

  const date = new Date(workflow.createdAt).toLocaleDateString();

  return (
    <div className="page-container">
      <Link to="/workflows" className="back-link">
        <ArrowLeft size={20} />
        <span>Back to Workflows</span>
      </Link>

      <div className="workflow-detail-header">
        <div className="header-meta">
          <span className={`badge badge-${workflow.difficulty || 'beginner'}`}>
            {workflow.difficulty || 'Beginner'}
          </span>
          <span className="badge badge-topic">{workflow.topic}</span>
        </div>
        <h1 className="detail-title">{workflow.instruction}</h1>
        
        <div className="header-stats">
          <div className="stat-item">
            <Clock size={16} />
            <span>Added {date}</span>
          </div>
          <div className="stat-item">
            <Activity size={16} />
            <span>Score: {workflow.score || 0}</span>
          </div>
        </div>
      </div>

      <div className="workflow-content-card">
        <div className="content-section">
          <h2>Output / Content</h2>
          <pre className="code-block">
            <code>{workflow.output}</code>
          </pre>
        </div>
      </div>

      <div className="workflow-actions mt-4">
        <button className="primary-btn">
          <Play size={18} />
          <span>Run Simulation</span>
        </button>
      </div>
    </div>
  );
};

export default WorkflowDetails;
