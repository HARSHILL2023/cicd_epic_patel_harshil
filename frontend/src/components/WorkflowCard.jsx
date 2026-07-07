import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import './WorkflowCard.css';

const WorkflowCard = ({ workflow }) => {
  const { _id, topic, instruction, difficulty, createdAt } = workflow;
  
  // Format date
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="workflow-card">
      <div className="card-header">
        <span className={`badge badge-${difficulty || 'beginner'}`}>
          {difficulty || 'Beginner'}
        </span>
        <span className="badge badge-topic">
          {topic}
        </span>
      </div>
      
      <div className="card-body">
        <h3 className="card-title line-clamp-2">{instruction}</h3>
      </div>
      
      <div className="card-footer">
        <div className="card-meta">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
        
        <Link to={`/workflows/${_id}`} className="card-action">
          <span>View Details</span>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default WorkflowCard;
