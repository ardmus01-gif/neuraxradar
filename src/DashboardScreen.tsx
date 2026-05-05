// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase'; 
import { ref, onValue, update, remove } from 'firebase/database';
import { LogOut, Users, Star, Settings2, Trash2, MapPin, Clock, Menu, X, Calendar, ShieldCheck } from 'lucide-react';

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
            if (data) {
                setUsers(Object.entries(data).map(([uid, val]) => ({ 
                    uid, 
                    ...val,
                    name: val.name || "Bilinmeyen Ajan",
                    email: val.email || "E-posta Yok"
                })));
            } else { setUsers([]); }
        });

        return () => { clearInterval(timer); window.removeEventListener('resize', handleResize); };
    }, []);

    // ⏳ GERİ SAYIM VE TARİH MOTORU
    const getLicenseInfo = (u) => {
        if (!u.expiryDate) return { text: "MÜHÜRSÜZ", color: "gray", start: "---" };
        
        const diff = u.expiryDate - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        // Aktivasyon tarihini formatla
        const startDate = u.activationDate ? new Date(u.activationDate).toLocaleString('tr-TR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : "Belirlenmedi";

        return { 
            text: days > 0 ? `${days} GÜN AKTİF` : "MÜHÜR DOLDU", 
            color: days > 0 ? "#00ff88" : "#ff4444",
            start: startDate
        };
    };

    // 💰 390 GÜN MÜHÜRLEME (Aktivasyon Tarihi Dahil)
    const extendLicense = (uid) => {
        const expiry = Date.now() + (390 * 24 * 60 * 60 * 1000);
        update(ref(db, `Users/${uid}`), { 
            expiryDate: expiry, 
            isPremium: true,
            activationDate: Date.now() // 🔥 Aktivasyon anını kaydet
        });
        alert("390 GÜNLÜK VIP MÜHÜR VE TARİH BASILDI!");
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff', fontFamily: 'sans-serif', flexDirection: isMobile ? 'column' : 'row' }}>
            
            {isMobile && (
                <div style={{ padding: 15, background: '#080808', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Menu onClick={() => setIsSidebarOpen(true)} color="#00B4FF" />
                    <b style={{color:'#00B4FF', letterSpacing:'2px'}}>NEURAX RADAR</b>
                    <div style={{width:24}}/>
                </div>
            )}

            <div style={{ 
                width: isMobile ? '80%' : '280px', background: '#050505', borderRight: '1px solid #111', 
                display: 'flex', flexDirection: 'column', position: isMobile ? 'fixed' : 'relative',
                left: isMobile && !isSidebarOpen ? '-100%' : '0', zIndex: 1000, height: '100vh', transition: '0.3s'
            }}>
                <div style={{ padding: 25 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
                        <h2 style={{ color: '#00B4FF', fontWeight: '900' }}>RADAR HUB</h2>
                        {isMobile && <X onClick={() => setIsSidebarOpen(false)} color="gray" />}
                    </div>
                    <div style={{ padding: '15px 20px', background: '#00B4FF11', borderRadius: 12, color: '#00B4FF', display: 'flex', gap: 10, fontWeight:'bold' }}>
                        <Users size={18}/> AJAN LİSTESİ
                    </div>
                </div>
                <button onClick={() => auth.signOut()} style={{ marginTop: 'auto', padding: 30, color: '#ff4444', border: 'none', background: 'transparent', fontWeight: 'bold', cursor: 'pointer', borderTop:'1px solid #111' }}>
                    <LogOut size={20}/> TERMİNALİ KAPAT
                </button>
            </div>

            <div style={{ flex: 1, padding: isMobile ? '20px' : '40px', overflowY: 'auto' }}>
                <h1 style={{fontSize: isMobile ? '22px' : '32px', fontWeight:'900', marginBottom:30}}>RADAR LİSANS MERKEZİ</h1>

                <div style={{ overflowX: 'auto', background: '#050505', borderRadius: 30, border: '1px solid #111' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                        <thead><tr style={{ color: '#444', borderBottom: '1px solid #111' }}><th style={{padding:20}}>AJAN</th><th>LİSANS DURUMU (390 GÜN)</th><th>İŞLEMLER</th></tr></thead>
                        <tbody>
                            {users.map(u => {
                                const lic = getLicenseInfo(u);
                                return (
                                    <tr key={u.uid} style={{ borderBottom: '1px solid #0a0a0a', background: u.isPremium ? 'rgba(0,180,255,0.01)' : 'transparent' }}>
                                        <td style={{ padding: 20 }}>
                                            <b style={{ color: u.isPremium ? 'gold' : '#fff', fontSize: '15px' }}>{u.isPremium && "👑 "}{u.name}</b>
                                            <br/><small style={{ color: '#333' }}>{u.email}</small>
                                        </td>
                                        <td style={{ padding: 20 }}>
                                            <div style={{ color: lic.color, fontWeight: '900', fontSize: 13 }}>{lic.text}</div>
                                            <div style={{ color: '#444', fontSize: 10, marginTop: 5 }}>Aktivasyon: {lic.start}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <button onClick={() => window.open(`https://www.google.com/maps?q=${u.lat},${u.lng}&z=18&t=k`)} style={styles.btnAction} title="Radar"><MapPin size={16} color="#00B4FF"/></button>
                                                <button onClick={() => setPermTarget(u)} style={styles.btnAction} title="Yönet"><Settings2 size={14}/></button>
                                                <button onClick={() => extendLicense(u.uid)} style={{...styles.btnAction, background:'#00ff8815'}} title="Lisans Bas"><Star size={16} color="#00ff88"/></button>
                                                <button onClick={() => {if(window.confirm("SİLİNSİN Mİ?")) remove(ref(db, `Users/${u.uid}`))}} style={{...styles.btnAction, color:'#f44'}}><Trash2 size={16}/></button>
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
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: 20, backdropFilter:'blur(10px)' }}>
                    <div style={{ background: '#0A0A0A', padding: 40, borderRadius: 50, width: '100%', maxWidth: '420px', border: '1px solid #222' }}>
                        <h3 style={{color:'#00B4FF', marginBottom:30}}>YÖNETİM: {permTarget.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 20, background: '#111', borderRadius: 20, alignItems: 'center', border: permTarget.isPremium ? '1px solid #FFD70044' : '1px solid #222' }}>
                            <b style={{color: 'gold'}}>👑 VIP DURUMU</b>
                            <input type="checkbox" style={{accentColor:'#00B4FF', width:25, height:25}} checked={permTarget.isPremium || false} onChange={e => update(ref(db, `Users/${permTarget.uid}`), { isPremium: e.target.checked })} />
                        </div>
                        <button onClick={() => extendLicense(permTarget.uid)} style={{ width: '100%', padding: 18, background: '#00B4FF', color: '#000', fontWeight: '900', borderRadius: 15, border: 'none', marginTop: 25 }}>390 GÜNLÜK MÜHÜRÜ BAS</button>
                        <button onClick={() => setPermTarget(null)} style={{ width: '100%', padding: 15, background: 'transparent', color: 'gray', border: 'none', marginTop: 15, fontWeight:'bold' }}>KAPAT</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    btnAction: { background: '#111', padding: '12px', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
};
