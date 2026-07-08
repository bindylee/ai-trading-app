import { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  riskTolerance: string;
  investmentExperience: string;
}

interface ProfileProps {
  user: any;
  setUser: (user: any) => void;
}

function Profile({ user, setUser }: ProfileProps) {
  const [profile, setProfile] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.data);
      setFormData(response.data.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        '/api/user/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data.data);
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Update failed');
    }
  };

  if (loading) return <div className="app-container"><p>Loading...</p></div>;

  return (
    <div className="app-container">
      <div className="profile-container">
        <h1>👤 User Profile</h1>

        {profile && (
          <div className="profile-card">
            {!isEditing ? (
              <>
                <div className="profile-info">
                  <p><strong>First Name:</strong> {profile.firstName}</p>
                  <p><strong>Last Name:</strong> {profile.lastName}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Risk Tolerance:</strong> {profile.riskTolerance}</p>
                  <p><strong>Investment Experience:</strong> {profile.investmentExperience}</p>
                </div>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData?.firstName || ''}
                  onChange={(e) => setFormData({ ...formData!, firstName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData?.lastName || ''}
                  onChange={(e) => setFormData({ ...formData!, lastName: e.target.value })}
                  required
                />
                <select
                  value={formData?.riskTolerance || ''}
                  onChange={(e) => setFormData({ ...formData!, riskTolerance: e.target.value })}
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
                <select
                  value={formData?.investmentExperience || ''}
                  onChange={(e) => setFormData({ ...formData!, investmentExperience: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <div className="form-buttons">
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;