// @ts-nocheck
import React, { useState } from "react";
import { Download, Search, Cpu, Lock, User, ShieldCheck } from "lucide-react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [detectedArch, setDetectedArch] = useState(null);

    const driveLinks = {
        "arm64-v8a": "https://www.dropbox.com/scl/fi/f621hbd71f2j4c2pp8vir/app-arm64-v8a-debug.apk?dl=1", 
        "armeabi-v7a": "https://www.dropbox.com/scl/fi/90avka1sn5hhovkdesaw2/app-armeabi-v7a-debug.apk?dl=1"
    };

    const handleSearch = (val) => {
        setSearchTerm(val);
        const query = val.toLowerCase();
        if (query.length < 2) { setDetectedArch(null); return; }
        if (query.includes("s4") || query.includes("s5") || query.includes("j7")) setDetectedArch({ arch: "armeabi-v7a", type: "Legacy" });
        else setDetectedArch({ arch: "arm64-v8a", type: "Modern" });
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) { alert("ERİŞİM REDDEDİLDİ!"); }
    };

    return (
        <div style={{ background: '#000', color: '#fff', minHeight: '100vh', textAlign: 'center', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#00B4FF', fontSize: '40px', fontWeight: '900' }}>NEURAX RADAR</h1>
            <p style={{ color: '#444' }}>SENTINEL SECURITY TERMINAL</p>

            <div style={{ maxWidth: '400px', margin: '40px auto', background: '#080808', padding: '30px', borderRadius: '30px', border: '1px solid #111' }}>
                <input type="email" placeholder="Agent Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
                <input type="password" placeholder="Security Code" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
                <button onClick={handleLogin} style={styles.btnLogin}>SİSTEME BAĞLAN</button>
            </div>

            <div style={{ maxWidth: '500px', margin: '0 auto', background: '#050505', padding: '30px', borderRadius: '30px', border: '1px solid #111' }}>
                <h3 style={{fontSize:'12px', color:'#00B4FF'}}>CİHAZ ANALİZİ</h3>
                <input type="text" placeholder="Cihaz modeliniz..." value={searchTerm} onChange={e => handleSearch(e.target.value)} style={styles.input} />
                {detectedArch && (
                    <button onClick={() => window.location.assign(driveLinks[detectedArch.arch])} style={styles.btnDownload}>
                        NEURAX RADAR {detectedArch.arch} İNDİR
                    </button>
                )}
            </div>
        </div>
    );
}

const styles = {
    input: { width: '100%', padding: '15px', background: '#000', border: '1px solid #222', borderRadius: '15px', color: '#fff', marginBottom: '15px', outline: 'none' },
    btnLogin: { width: '100%', padding: '15px', background: '#00B4FF', color: '#000', fontWeight: '900', borderRadius: '15px', border: 'none', cursor: 'pointer' },
    btnDownload: { width: '100%', padding: '15px', background: '#111', color: '#00B4FF', fontWeight: '900', borderRadius: '15px', border: '1px solid #00B4FF', cursor: 'pointer' }
};