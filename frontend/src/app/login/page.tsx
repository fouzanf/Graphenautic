"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Loader2, CheckCircle2, Sparkles, Cpu, Fingerprint, ChevronLeft, Key } from 'lucide-react';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<'idle' | 'oauth' | 'verifying' | 'success'>('idle');
  
  // 3D Tilt calculation
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Max tilt 12 degrees
    const rotateY = (x / (rect.width / 2)) * 12;
    const rotateX = -(y / (rect.height / 2)) * 12;
    setCardTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setCardTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleGoogleLogin = async () => {
    if (loadingState !== 'idle') return;
    setLoadingState('oauth');
    
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error('OAuth sign in error:', err);
      setLoadingState('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#020510] text-slate-200 font-sans overflow-hidden relative flex flex-col justify-between selection:bg-blue-500/30">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.35; }
        }
        @keyframes laser-sweep {
          0% { top: -10%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-float-orb {
          animation: float-orb 8s ease-in-out infinite;
        }
        .animate-laser {
          animation: laser-sweep 4s linear infinite;
        }
      `}} />

      {/* Ambient background lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[140px] animate-float-orb" />
        <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] rounded-full bg-purple-600/15 blur-[160px] animate-float-orb" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[130px] animate-float-orb" style={{ animationDelay: '6s' }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Top Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50 h-24 flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto w-full border-b border-white/5 bg-[#020510]/40 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.5)] border border-blue-400/40 group-hover:scale-105 transition-transform">
            <span className="text-white italic text-xl leading-none font-black">G</span>
          </div>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">Graphenautic</span>
        </Link>
        <Link href="/">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs sm:text-sm backdrop-blur transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-slate-700">
            <ChevronLeft className="w-4 h-4 text-blue-400" />
            <span>Return to Landing</span>
          </button>
        </Link>
      </header>

      {/* Main Authentication Section */}
      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-16 relative z-10" style={{ perspective: '1600px' }}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-lg transition-all duration-300 relative"
          style={{
            transform: `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Laser scanning beam across the auth card */}
          <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(6,182,212,1)] z-40 pointer-events-none animate-laser hidden sm:block" />

          {/* Floating Extruded Badge Left */}
          <div className="absolute -left-16 top-10 z-50 bg-[#050a1a]/90 border border-cyan-500/30 rounded-2xl p-3.5 hidden lg:flex flex-col gap-1 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-float-orb pointer-events-none" style={{ transform: 'translateZ(40px)' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">OAuth 2.0 Protocol</span>
            </div>
            <div className="text-xs font-mono font-bold text-slate-300">Google Secure Enclave</div>
          </div>

          {/* Floating Extruded Badge Right */}
          <div className="absolute -right-16 bottom-16 z-50 bg-[#050a1a]/90 border border-purple-500/30 rounded-2xl p-3.5 hidden lg:flex flex-col gap-1 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-float-orb pointer-events-none" style={{ animationDelay: '2s', transform: 'translateZ(40px)' }}>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">Zero-Knowledge</span>
            </div>
            <div className="text-xs font-mono font-bold text-slate-300">OpenID Connect</div>
          </div>

          {/* Glowing Backing Shadow */}
          <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 opacity-40 blur-2xl -z-10 group-hover:opacity-60 transition-opacity duration-500" />

          {/* Main Card Wrapper */}
          <div className="bg-[#040817]/90 backdrop-blur-3xl border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.95)] relative overflow-hidden text-center">
            {/* Top Specular Shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent" />

            {/* Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 text-xs font-bold tracking-wider mb-6 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="uppercase tracking-widest font-black">Google Identity Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Access Deep Research</h1>
              <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                Seamlessly authenticate with your enterprise Google Workspace or personal Google Account.
              </p>
            </div>

            {/* Google Authentication Button Box */}
            <div className="py-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loadingState !== 'idle'}
                className={`w-full relative overflow-hidden p-1 rounded-2xl font-bold text-base shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 group ${
                  loadingState === 'success'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 scale-[1.02] shadow-[0_0_50px_rgba(16,185,129,0.8)]'
                    : loadingState !== 'idle'
                    ? 'bg-slate-800'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:shadow-[0_0_60px_rgba(59,130,246,0.8)] hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <div className={`w-full py-4 px-6 rounded-[14px] flex items-center justify-center gap-3 transition-colors ${
                  loadingState === 'success'
                    ? 'bg-emerald-600 text-white font-black'
                    : loadingState !== 'idle'
                    ? 'bg-[#070e24] text-blue-400 font-mono text-sm'
                    : 'bg-[#070e24] group-hover:bg-[#0a1433] text-white font-black'
                }`}>
                  {loadingState === 'idle' && (
                    <>
                      {/* Premium Multicolored Google SVG */}
                      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.705-.06-1.405-.19-2.095H12v4.51h6.66c-.295 1.545-1.165 2.855-2.485 3.735v3.1h4.01c2.35-2.165 3.705-5.35 3.705-9.25Z" />
                        <path fill="#34A853" d="M12 24c3.305 0 6.085-1.095 8.115-2.98l-4.01-3.1c-1.105.74-2.52 1.18-4.105 1.18-3.155 0-5.825-2.135-6.78-5.005H1.085v3.21C3.125 21.35 7.235 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.22 14.095c-.24-.72-.375-1.495-.375-2.295 0-.8.135-1.575.375-2.295v-3.21H1.085A11.96 11.96 0 0 0 0 11.8c0 1.92.455 3.74 1.085 5.505l4.135-3.21Z" />
                        <path fill="#EA4335" d="M12 4.905c1.795 0 3.41.615 4.68 1.825l3.515-3.515C18.075 1.22 15.3 0 12 0 7.235 0 3.125 2.65 1.085 6.705l4.135 3.21c.955-2.87 3.625-5.01 6.78-5.01Z" />
                      </svg>
                      <span className="text-base tracking-wide">Continue with Google</span>
                      <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  {loadingState === 'oauth' && (
                    <>
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      <span>Connecting to Google OAuth Enclave...</span>
                    </>
                  )}
                  {loadingState === 'verifying' && (
                    <>
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                      <span>Verifying Cryptographic Identity...</span>
                    </>
                  )}
                  {loadingState === 'success' && (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-white animate-bounce" />
                      <span className="text-base font-black">Identity Confirmed. Routing to Canvas...</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Terms Agreement Note */}
            <p className="mt-8 text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
              By continuing, you acknowledge that your Google identity token will be securely verified via OpenID Connect protocols.
            </p>

            {/* Bottom info */}
            <div className="mt-10 pt-8 border-t border-slate-800/80 flex items-center justify-center gap-6 font-mono text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-blue-500" /> OAuth 2.0</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-500" /> Cloud Enclave</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-500" /> ISO-27001</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-[#020510] text-center text-xs text-slate-600 font-mono relative z-10">
        <p>Graphenautic Enterprise Research Framework &copy; {new Date().getFullYear()}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
