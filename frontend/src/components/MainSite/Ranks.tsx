import React, { useEffect, useState } from 'react';

interface UserRank {
  username: string;
  points: number;
  avatar?: string;
  rank: number;
}

const Ranks: React.FC = () => {
  const [users, setUsers] = useState<UserRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile/ranks')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign:'center',marginTop:'4rem',fontSize:'2rem'}}>Yuklanmoqda...</div>;

  // Split users into top 3 and the rest
  const top3 = users.slice(0, 3);
  const others = users.slice(3);

  // Determine if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  // Card styles for top 3 (responsive)
  const cardStyles = [
    {
      order: 2,
      background: '#fff8e1',
      borderColor: '#ffd700',
      color: '#bfa100',
      boxShadow: '0 2px 24px rgba(255,215,0,0.18)',
      width: isMobile ? 125 : 275,
      minWidth: isMobile ? 95 : 255,
      maxWidth: isMobile ? 145 : 305,
      zIndex: 2,
      transform: isMobile ? 'scale(0.88)' : 'scale(1.15)',
    },
    {
      order: 1,
      background: '#f8fafd',
      borderColor: '#c0c0c0',
      color: '#888',
      boxShadow: '0 2px 16px rgba(192,192,192,0.13)',
      width: isMobile ? 105 : 225,
      minWidth: isMobile ? 75 : 205,
      maxWidth: isMobile ? 125 : 245,
      zIndex: 1,
      transform: isMobile ? 'scale(0.78)' : 'scale(1.05)',
    },
    {
      order: 3,
      background: '#fff4e1',
      borderColor: '#cd7f32',
      color: '#b87333',
      boxShadow: '0 2px 16px rgba(205,127,50,0.13)',
      width: isMobile ? 105 : 225,
      minWidth: isMobile ? 75 : 205,
      maxWidth: isMobile ? 125 : 245,
      zIndex: 1,
      transform: isMobile ? 'scale(0.78)' : 'scale(1.05)',
    },
  ];

  // Medal emoji/icons for top 3
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f2', padding: '1.8rem' }}>
      <h1 style={{ textAlign: 'center', color: '#f76c6c', fontFamily: 'cursive', fontWeight: 700, fontSize: 38, margin: '2.5rem 0 4rem' }}>Foydalanuvchilar Reytingi</h1>
      {/* Top 3 as special cards */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: isMobile ? '0.5rem' : '2.5rem',
          justifyContent: 'center',
          alignItems: 'flex-end',
          marginBottom: '2.5rem',
          marginTop: '2rem',
        }}
      >
        {top3.map((user, i) => (
          <div key={user.rank} style={{
            ...cardStyles[i],
            background: cardStyles[i].background,
            border: `3.5px solid ${cardStyles[i].borderColor}`,
            color: cardStyles[i].color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            marginBottom: 10,
            borderRadius: 22,
            boxShadow: cardStyles[i].boxShadow,
            order: cardStyles[i].order,
            zIndex: cardStyles[i].zIndex,
            transform: cardStyles[i].transform,
            transition: 'transform 0.2s',
            marginLeft: isMobile ? '0.2rem' : '1.5rem',
            marginRight: isMobile ? '0.2rem' : '1.5rem',
          }}>
            <div style={{
              position: 'absolute',
              top: isMobile ? -21 : -33,
              left: '50%',
              transform: 'translateX(-50%)',
              background: cardStyles[i].borderColor,
              color: '#fff',
              fontWeight: 900,
              fontSize: isMobile ? 23 : 33,
              borderRadius: '50%',
              width: isMobile ? 37 : 59,
              height: isMobile ? 37 : 59,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              border: `2.5px solid #fff`,
            }}>
              {medals[i]}
            </div>
            <img src={user.avatar || '/logo.png'} alt={user.username} style={{
              width: i === 0 ? (isMobile ? 53 : 95) : (isMobile ? 43 : 75),
              height: i === 0 ? (isMobile ? 53 : 95) : (isMobile ? 43 : 75),
              borderRadius: '50%',
              border: `3px solid ${cardStyles[i].borderColor}`,
              marginTop: isMobile ? 23 : 43,
              marginBottom: isMobile ? 13 : 21,
              objectFit: 'cover',
              background: '#f8f6f2',
              boxShadow: i === 0 ? (isMobile ? undefined : '0 4px 16px rgba(255,215,0,0.10)') : undefined,
            }} />
            <div style={{ fontWeight: 700, fontSize: 20, color: cardStyles[i].color, marginBottom: 6 }}>{user.username}</div>
            <div style={{ fontSize: i === 0 ? (isMobile ? 17 : 23) : (isMobile ? 16 : 21), color: '#444', marginBottom: 2 }}>Ballar: <b>{user.points}</b></div>
          </div>
        ))}
      </div>
      {/* Others as a list */}
      {others.length > 0 && (
        <div style={{ maxWidth: 900, minWidth: 340, minHeight: 320, margin: '0 auto', background: '#fff999', borderRadius: 14, boxShadow: '0 2px 12px rgba(247,108,108,0.08)', padding: '1.5rem 1.2rem', fontSize: '1.25rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {others.map(user => (
              <li key={user.rank} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f8f6f2', padding: '0.9rem 0', minHeight: 54, fontSize: '1.15rem' }}>
                <span style={{ fontWeight: 700, color: '#f76c6c', width: 32, display: 'inline-block', textAlign: 'center' }}>{user.rank}</span>
                <img src={user.avatar || '/logo.png'} alt={user.username} style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #ffe082', marginRight: 12, objectFit: 'cover', background: '#f8f6f2' }} />
                <span style={{ fontWeight: 900, color: '#444', flex: 1, fontSize: 18 }}>{user.username}</span>
                <span style={{ color: '#888', fontWeight: 500 }}>Ballar: <b>{user.points}</b></span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Ranks;
