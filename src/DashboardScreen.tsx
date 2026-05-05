// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase'; 
import { ref, onValue, update, remove } from 'firebase/database';
import { LogOut, Users, Star, Settings2, Trash2, MapPin, Clock, Menu, X, Calendar } from 'lucide-react';

export default function DashboardScreen() {
    const [users, setUsers] = useState([]);
    const [permTarget, setPermTarget] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        const timer = setInterval(() => setNow(Date.now()), 1000);
        
        onValue(ref(db, "Users"), (snap) => {
            const data = snap.val();
            if (data) setUsers(Object.entries(data).map(([uid, val]) => ({ uid, ...val })));
            else setUsers([]);
        });

        return () => { clearInterval(timer); window.removeEventListener('resize', handleResize); };
    }, []);

    const getLicenseInfo = (expiryDate) => {
        if (!expiryDate) return { text: "YOK", color: "gray" };
        const diff = expiryDate - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return { text: days > 0 ? `${days} GÜN AKTİF` : "SÜRE DOLDU", color: days > 0 ? "#00ff88" : "#ff4444" };
    };

    const extendLicense = (uid) => {
        const expiry = Date.now() + (390 * 24 * 60 * 60 * 1000);
        update(ref(db, `Users/${uid}`), { expiryDate: expiry, isPremium: true });
        alert("390 GÜN MÜHÜRLENDİ!");
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff', fontFamily: 'sans-serif', flexDirection: isMobile ? 'column' : 'row' }}>
            
            {isMobile && (
                <div style={{ padding: 15, background: '#080808', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Menu onClick={() => setIsSidebarOpen(true)} color="#00B4FF" />
                    <b style={{color:'#00B4FF'}}>NEURAX RADAR</b>
                    <div style={{width:24}}/>
                </div>
            )}

            <div style={{ 
                width: isMobile ? '80%' : '280px', background: '#050505', borderRight: '1px solid #111', 
                display: 'flex', flexDirection: 'column', position: isMobile ? 'fixed' : 'relative',
                left: isMobile && !isSidebarOpen ? '-100%' : '0', zIndex: 1000, height: '100vh', transition: '0.3s'
            }}>
                <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
                        <h2 style={{ color: '#00B4FF', fontWeight: '900' }}>RADAR HUB</h2>
                        {isMobile && <X onClick={() => setIsSidebarOpen(false)} />}
                    </div>
                    <div style={{ padding: 15, background: '#00B4FF11', borderRadius: 12, color: '#00B4FF', display: 'flex', gap: 10 }}><Users size={18}/> AJANLAR</div>
                    <div style={{ marginTop: 20, padding: 15, background: '#111', borderRadius: 10, fontSize: 11, color: '#444' }}>
                        <Calendar size={12}/> {new Date().toLocaleDateString()}<br/>
                        <Clock size={12}/> {new Date().toLocaleTimeString()}
                    </div>
                </div>
                <button onClick={() => auth.signOut()} style={{ marginTop: 'auto', padding: 25, color: '#ff4444', border: 'none', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}><LogOut size={20}/> ÇIKIŞ</button>
            </div>

            <div style={{ flex: 1, padding: isMobile ? '20px' : '40px', overflowY: 'auto' }}>
                <h1 style={{fontSize: isMobile ? '20px' : '28px', marginBottom: 30}}>RADAR LİSANS YÖNETİMİ</h1>
                <div style={{ overflowX: 'auto', background: '#050505', borderRadius: 25, border: '1px solid #111' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead><tr style={{ color: '#444', borderBottom: '1px solid #111' }}><th style={{padding:15}}>AJAN</th><th>LİSANS</th><th>İŞLEM</th></tr></thead>
                        <tbody>
                            {users.map(u => {
                                const lic = getLicenseInfo(u.expiryDate);
                                return (
                                    <tr key={u.uid} style={{ borderBottom: '1px solid #0a0a0a' }}>
                                        <td style={{ padding: 15 }}><b style={{ color: u.isPremium ? 'gold' : '#fff' }}>{u.isPremium && "👑 "}{u.name}</b><br/><small style={{ color: '#333' }}>{u.email}</small></td>
                                        <td style={{ color: lic.color, fontWeight: 'bold', fontSize: 11 }}>{lic.text}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => window.open(`https://www.google.com/maps?q=${u.lat},${u.lng}&z=18&t=k`)} style={styles.btnAction}><MapPin size={14} color="#00B4FF"/></button>
                                                <button onClick={() => setPermTarget(u)} style={styles.btnAction}><Settings2 size={14}/></button>
                                                <button onClick={() => extendLicense(u.uid)} style={{...styles.btnAction, background:'#00ff8815'}}><Star size={14} color="#00ff88"/></button>
                                                <button onClick={() => remove(ref(db, `Users/${u.uid}`))} style={{...styles.btnAction, color:'#f44'}}><Trash2 size={14}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {permTarget && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: 20 }}>
                    <div style={{ background: '#0A0A0A', padding: 30, borderRadius: 40, width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
                        <h3 style={{color:'#00B4FF', marginBottom:20}}>LİSANS: {permTarget.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 15, background: '#111', borderRadius: 15, alignItems: 'center' }}>
                            <b style={{color:'gold'}}>PREMIUM AKTİF</b>
                            <input type="checkbox" style={{accentColor:'#00B4FF', width:22, height:22}} checked={permTarget.isPremium || false} onChange={e => update(ref(db, `Users/${permTarget.uid}`), { isPremium: e.target.checked })} />
                        </div>
                        <button onClick={() => extendLicense(permTarget.uid)} style={{ width: '100%', padding: 15, background: '#00B4FF', color: '#000', fontWeight: 'bold', borderRadius: 15, border: 'none', marginTop: 20 }}>390 GÜN MÜHÜRLE</button>
                        <button onClick={() => setPermTarget(null)} style={{ width: '100%', padding: 15, background: 'transparent', color: 'gray', border: 'none', marginTop: 10 }}>KAPAT</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    btnAction: { background: '#111', padding: '10px', borderRadius: '10px', border: '1px solid #222', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }
};