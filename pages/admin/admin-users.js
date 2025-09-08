
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/get-users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
        setMessage(`Found ${data.users.length} users`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Delete all users
  const deleteAllUsers = async () => {
    if (!window.confirm('⚠️ WARNING: This will delete ALL users permanently. Are you absolutely sure?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch('/api/admin/delete-all-users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmation: 'DELETE_ALL_USERS'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message}. Successfully deleted: ${data.summary.successful}, Failed: ${data.summary.failed}`);
        setUsers([]); // Clear the users list
        setShowDeleteConfirm(false);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
    setDeleteLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin - User Management</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchUsers}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Fetch All Users'}
        </button>

        <button 
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleteLoading || users.length === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: (deleteLoading || users.length === 0) ? 'not-allowed' : 'pointer'
          }}
        >
          {deleteLoading ? 'Deleting...' : 'Delete All Users'}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#dc3545' }}>⚠️ DANGER ZONE</h2>
            <p>You are about to delete <strong>ALL {users.length} users</strong> permanently.</p>
            <p>This action <strong>CANNOT BE UNDONE</strong>.</p>
            
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '10px 20px',
                  marginRight: '10px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={deleteAllUsers}
                disabled={deleteLoading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: deleteLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteLoading ? 'Deleting...' : 'YES, DELETE ALL USERS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          backgroundColor: message.includes('Error') || message.includes('❌') ? '#f8d7da' : '#d1edff',
          border: '1px solid',
          borderColor: message.includes('Error') || message.includes('❌') ? '#f5c6cb' : '#bee5eb',
          borderRadius: '5px',
          color: message.includes('Error') || message.includes('❌') ? '#721c24' : '#0c5460'
        }}>
          {message}
        </div>
      )}

      {/* Users List */}
      {users.length > 0 && (
        <div>
          <h3>Current Users ({users.length})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {users.map((user, index) => (
              <div key={user.id} style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '5px',
                fontSize: '14px'
              }}>
                <strong>{index + 1}.</strong> {user.email} 
                <span style={{ color: '#6c757d', marginLeft: '10px' }}>
                  (Created: {new Date(user.created_at).toLocaleDateString()})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
        <h4>🛡️ Security Notes:</h4>
        <ul>
          <li>This interface provides admin access to user management</li>
          <li>Always fetch users first to see what will be deleted</li>
          <li>The delete operation includes all related data (applications, accounts, enrollments)</li>
          <li>Deleted users cannot be recovered</li>
        </ul>
      </div>
    </div>
  );
}
