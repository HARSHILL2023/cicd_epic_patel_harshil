import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Activity, Users, BookOpen, Server, TrendingUp, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 550 },
  { name: 'Thu', value: 480 },
  { name: 'Fri', value: 700 },
  { name: 'Sat', value: 650 },
  { name: 'Sun', value: 800 },
];

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch simple summary
        const res = await api.get('/analytics/summary');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name || 'Developer'}</h1>
          <p>Here's what's happening with your pipelines today.</p>
        </div>
        <Link to="/workflows" className="action-btn">
          Explore Workflows
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue"><Activity size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Total Executions</p>
            <h3 className="stat-value">{stats?.totalExecutions || '12,450'}</h3>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-green"><BookOpen size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Knowledge Items</p>
            <h3 className="stat-value">{stats?.totalItems || '342'}</h3>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-purple"><Server size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Active Nodes</p>
            <h3 className="stat-value">{stats?.activeNodes || '48'}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red"><AlertCircle size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Failed Pipelines</p>
            <h3 className="stat-value">{stats?.failedPipelines || '3'}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        {/* Chart Section */}
        <div className="chart-section dashboard-card">
          <div className="card-header">
            <h3>Deployment Frequency</h3>
            <TrendingUp size={20} className="text-gray" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section dashboard-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-list">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot bg-blue"></div>
                <div className="activity-content">
                  <p className="activity-text"><strong>Kubernetes Cluster</strong> deployment completed</p>
                  <span className="activity-time">{i * 15} minutes ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
