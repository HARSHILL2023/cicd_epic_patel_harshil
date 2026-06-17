import React, { useEffect, useState } from 'react';
import { Activity, Users, ShieldAlert, Cpu, HardDrive, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, sysRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/system/info')
      ]);
      setUsers(usersRes.data.data.users);
      setSystemInfo(sysRes.data.data);
    } catch (error) {
      console.error('Admin data fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Admin Control Panel</h1>
          <p>System health, user management, and global configurations.</p>
        </div>
        <button onClick={fetchAdminData} className="refresh-btn">
          <RefreshCw size={18} /> Refresh Data
        </button>
      </div>

      {/* System Health */}
      <section className="admin-section">
        <h2 className="section-title"><Activity size={20} /> System Health Overview</h2>
        <div className="health-grid">
          <div className="health-card">
            <Cpu className="text-blue" size={32} />
            <div>
              <p className="health-label">Node Version</p>
              <h3>{systemInfo?.nodeVersion || 'v18.17.0'}</h3>
            </div>
          </div>
          <div className="health-card">
            <HardDrive className="text-purple" size={32} />
            <div>
              <p className="health-label">Memory Usage</p>
              <h3>{systemInfo?.memory?.usedMB || '0'} MB</h3>
            </div>
          </div>
          <div className="health-card">
            <ShieldAlert className={systemInfo?.uptime > 0 ? "text-green" : "text-red"} size={32} />
            <div>
              <p className="health-label">System Status</p>
              <h3>{systemInfo?.uptime > 0 ? 'Healthy' : 'Critical'}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* User Management */}
      <section className="admin-section mt-8">
        <div className="section-header">
          <h2 className="section-title"><Users size={20} /> User Management</h2>
          <span className="badge badge-topic">Total: {users.length}</span>
        </div>
        
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">{user.name.charAt(0)}</div>
                      {user.name}
                    </div>
                  </td>
                  <td className="text-gray">{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="text-gray">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="text-btn text-blue">Edit</button>
                    <button className="text-btn text-red ml-2">Block</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
