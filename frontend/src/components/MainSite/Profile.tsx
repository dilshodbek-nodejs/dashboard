import React, { useEffect, useState } from 'react';
import './main-site.css';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  rating?: number;
  rank?: number;
  activity?: number[];
  username?: string;
  solvedTests?: string[];
  points?: number;
  solvedQuizPacks?: string[];
  globalStats?: {
    totalTestPacks: number;
    solvedTestPacks: number;
    totalTests: number;
    solvedTests: number;
    percentCorrect: number;
    correctTests: number;
  };
  userRank?: number;
  totalUsers?: number;
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getCookie('token');
        const res = await fetch('/api/profile/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Foydalanuvchi maʼlumotlarini olishda xatolik');
        const data = await res.json();
        setUser({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          avatar: data.avatar || '/logo.png',
          rating: data.rating || 1,
          rank: data.rank === 0 ? data.rank : 20,
          activity: data.activity || [2, 5, 4, 6, 7, 6, 9],
          username: data.username || '',
          solvedTests: data.solvedTests || [],
          points: data.points || 0,
          solvedQuizPacks: data.solvedQuizPacks || [],
          globalStats: data.globalStats || undefined,
          userRank: data.userRank || undefined,
          totalUsers: data.totalUsers || undefined,
        });
      } catch (err: any) {
        setError(err.message || 'Xatolik yuz berdi');
        setUser({
          firstName: 'Ali',
          lastName: 'Yusupov',
          email: 'aliyusupov@example.com',
          avatar: '/logo.png',
          rating: 1,
          rank: 20,
          activity: [2, 5, 4, 6, 7, 6, 9],
          username: 'aliyusupov',
          solvedTests: [],
          points: 0,
          solvedQuizPacks: [],
          globalStats: undefined,
          userRank: undefined,
          totalUsers: undefined,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditData(user);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setSaving(true);
    setError('');
    try {
      const token = getCookie('token');
      const res = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: editData.username,
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
          avatar: editData.avatar
        })
      });
      if (!res.ok) throw new Error('Maʼlumotlarni saqlashda xatolik');
      const data = await res.json();
      setUser({ ...user!, ...data.user });
      setEditMode(false);
      setEditData(null);
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setAvatarUploading(true);
    setError('');
    try {
      const token = getCookie('token');
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('/api/profile/me/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Avatar yuklashda xatolik');
      }
      const data = await res.json();
      if (editData) setEditData({ ...editData, avatar: data.avatar });
      if (user) setUser({ ...user, avatar: data.avatar });
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) return <div style={{textAlign:'center',marginTop:'4rem',fontSize:'2rem'}}>Yuklanmoqda...</div>;

  return (
    <div className="profile-page-bg" style={{ minHeight: '100vh', background: '#f8f6f2', padding: '2rem' }}>
      <div className="profile-page-container" style={{ maxWidth: 700, margin: '0 auto', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', background: '#fff', padding: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 260px', minWidth: 240 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#ffe082', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <img src={editMode ? (editData?.avatar || '/logo.png') : (user?.avatar || '/logo.png')} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%' }} />
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '2rem 1.5rem', marginBottom: 20 }}>
            {editMode ? (
              <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleSave}>
                <label style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Profil rasmi
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                    <img src={editData?.avatar || '/logo.png'} alt="avatar" style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid #b3d1fa', objectFit: 'cover' }} />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ fontSize: 15 }} />
                    {avatarUploading && <span style={{ color: '#2563eb', fontSize: 15 }}>Yuklanmoqda...</span>}
                  </div>
                </label>
                <label style={{ fontWeight: 500, fontSize: 16 }}>Foydalanuvchi nomi
                  <input type="text" name="username" value={editData?.username || ''} onChange={handleChange} style={{ width: '100%', marginTop: 4, borderRadius: 10, border: '1.5px solid #b3d1fa', padding: '10px 14px', fontSize: 15, background: '#f8faff', outline: 'none', transition: 'border 0.2s' }} />
                </label>
                <label style={{ fontWeight: 500, fontSize: 16 }}>Ism
                  <input type="text" name="firstName" value={editData?.firstName || ''} onChange={handleChange} style={{ width: '100%', marginTop: 4, borderRadius: 10, border: '1.5px solid #b3d1fa', padding: '10px 14px', fontSize: 15, background: '#f8faff', outline: 'none', transition: 'border 0.2s' }} />
                </label>
                <label style={{ fontWeight: 500, fontSize: 16 }}>Familiya
                  <input type="text" name="lastName" value={editData?.lastName || ''} onChange={handleChange} style={{ width: '100%', marginTop: 4, borderRadius: 10, border: '1.5px solid #b3d1fa', padding: '10px 14px', fontSize: 15, background: '#f8faff', outline: 'none', transition: 'border 0.2s' }} />
                </label>
                <label style={{ fontWeight: 500, fontSize: 16 }}>Email
                  <input type="email" name="email" value={editData?.email || ''} onChange={handleChange} style={{ width: '100%', marginTop: 4, borderRadius: 10, border: '1.5px solid #b3d1fa', padding: '10px 14px', fontSize: 15, background: '#f8faff', outline: 'none', transition: 'border 0.2s' }} />
                </label>
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button type="submit" disabled={saving} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 17, fontWeight: 500, cursor: 'pointer', flex: 1 }}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
                  <button type="button" onClick={handleCancel} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 17, fontWeight: 500, cursor: 'pointer', flex: 1 }}>Bekor qilish</button>
                </div>
              </form>
            ) : (
              <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label style={{ fontWeight: 500, fontSize: 16 }}>Foydalanuvchi nomi
                  <input type="text" value={user?.username || ''} readOnly style={{ width: '100%', marginTop: 4, borderRadius: 10, border: '1.5px solid #e0e7ef', padding: '10px 14px', fontSize: 15, background: '#f8faff', color: '#888', outline: 'none' }} />
                </label>
                <label style={{ fontWeight: 500, fontSize: 16 }}>Ism
                  <input type="text" value={user?.firstName || ''} readOnly style={{ width: '100%', marginTop: 4, borderRadius: 10, border: '1.5px solid #e0e7ef', padding: '10px 14px', fontSize: 15, background: '#f8faff', color: '#888', outline: 'none' }} />
                </label>
                <label style={{ fontWeight: 500, fontSize: 16 }}>Familiya
                  <input type="text" value={user?.lastName || ''} readOnly style={{ width: '100%', marginTop: 4, borderRadius: 10, border: '1.5px solid #e0e7ef', padding: '10px 14px', fontSize: 15, background: '#f8faff', color: '#888', outline: 'none' }} />
                </label>
                <label style={{ fontWeight: 500, fontSize: 16 }}>Email
                  <input type="email" value={user?.email || ''} readOnly style={{ width: '100%', marginTop: 4, borderRadius: 10, border: '1.5px solid #e0e7ef', padding: '10px 14px', fontSize: 15, background: '#f8faff', color: '#888', outline: 'none' }} />
                </label>
                <button type="button" onClick={handleEdit} style={{ marginTop: 10, background: '#f76c6c', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Tahrirlash</button>
                <button type="button" onClick={() => { deleteCookie('token'); navigate('/login'); }} style={{ marginTop: 10, background: '#888', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Chiqish</button>
              </form>
            )}
          </div>
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 200, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: '#f8f6f2', borderRadius: 16, padding: '1.2rem 1.5rem', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Haftalik Faollik</div>
            <ProfileActivityChart data={user?.activity || [2, 5, 4, 6, 7, 6, 9]} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginTop: 6 }}>
              <span>Dush</span><span>Sesh</span><span>Chor</span><span>Pay</span><span>Jum</span><span>Shan</span><span>Yak</span>
            </div>
          </div>
          <div style={{ background: '#f8f6f2', borderRadius: 16, padding: '1.2rem 1.5rem', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Ballar</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f76c6c', marginBottom: 4 }}>{user?.points ?? 0}</div>
          </div>
          <div style={{ background: '#f8f6f2', borderRadius: 16, padding: '1.2rem 1.5rem', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Reyting</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ background: '#ffe082', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: '#f76c6c' }}>{user?.userRank ?? '-'}</span>
              </div>
              <span style={{ fontSize: 17, color: '#444', fontWeight: 500 }}>{user?.userRank ?? '-'} / {user?.totalUsers ?? '-'}-o‘rin</span>
            </div>
          </div>
          {/* Global stats card */}
          {user?.globalStats && (
            <>
              <div style={{ minWidth: 260, maxWidth: 400, background: '#e3f0ff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.13)', padding: '2rem', margin: '0 auto 2rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1.5px solid #b3d1fa' }}>
                <div style={{ fontWeight: 700, fontSize: 22, color: '#2563eb', marginBottom: 12 }}>Testlar Statistikasi</div>
                <div style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>Test packlar: <b>{user.globalStats.totalTestPacks}</b> / <b>{user.globalStats.solvedTestPacks}</b></div>
                <div style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>Testlar: <b>{user.globalStats.totalTests}</b> / <b>{user.globalStats.solvedTests}</b></div>
                <div style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>To‘g‘ri javoblar: <b>{user.globalStats.correctTests}</b> (<b>{user.globalStats.percentCorrect}%</b>)</div>
              </div>
              <button
                onClick={() => navigate('/quiz')}
                style={{
                  display: 'block',
                  margin: '0 auto 2rem auto',
                  background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18,
                  border: 'none',
                  borderRadius: 12,
                  padding: '1rem 2.5rem',
                  boxShadow: '0 2px 12px rgba(37,99,235,0.13)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  letterSpacing: 1
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)')}
                onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)')}
              >
                Go to Quiz
              </button>
            </>
          )}
        </div>
      </div>
      <h1 style={{ textAlign: 'center', color: '#f76c6c', fontFamily: 'cursive', fontWeight: 700, fontSize: 38, margin: '2.5rem 0 0.5rem' }}>Mening Profilim</h1>
      {error && <div style={{color:'#f76c6c',textAlign:'center',marginTop:'1rem',fontSize:'1.2rem'}}>{error}</div>}
    </div>
  );
};

// Simple SVG line chart for activity
const ProfileActivityChart: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => `${(i * 40) + 10},${60 - (v / max) * 40}`).join(' ');
  return (
    <svg width="270" height="70" style={{ display: 'block', margin: '0 auto' }}>
      <polyline
        fill="none"
        stroke="#f76c6c"
        strokeWidth="3"
        points={points}
      />
      {data.map((v, i) => (
        <circle key={i} cx={(i * 40) + 10} cy={60 - (v / max) * 40} r="4" fill="#f76c6c" />
      ))}
    </svg>
  );
};

export default Profile; 