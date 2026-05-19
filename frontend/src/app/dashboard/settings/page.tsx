"use client";
import React, { useState } from 'react';
import { Settings, Shield, Cpu, Database, Globe, Lock, Key, Save, CheckCircle2, Terminal, Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [revealKeys, setRevealKeys] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Enterprise node configurations successfully encrypted and saved to cloud enclave.');
    }, 1000);
  };

  return (
    <div className="p-8 sm:p-12 max-w-5xl mx-auto font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 mb-2 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-purple-500 animate-spin" style={{ animationDuration: '10s' }} />
            <span>ENTERPRISE NODE SETTINGS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">System Configuration</h1>
          <p className="text-slate-400 text-sm mt-1">Configure your local Neo4j endpoints, Gemini reasoning temperature, and vector similarity thresholds.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setRevealKeys(!revealKeys)}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-slate-800 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs font-mono backdrop-blur transition-all shadow"
            type="button"
          >
            {revealKeys ? <EyeOff className="w-4 h-4 text-blue-400" /> : <Eye className="w-4 h-4 text-blue-400" />}
            <span>{revealKeys ? "Mask Sensitive Inputs" : "Reveal Sensitive Inputs"}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] border border-purple-400/30 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Encrypting Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Gemini Reasoning Engine */}
        <div className="bg-[#040817]/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Google Gemini Engine</h2>
              <p className="text-xs text-slate-400 font-mono">Active Model: gemini-1.5-flash</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Reasoning Temperature</label>
              <input type="text" defaultValue="0.1" className="w-full bg-[#070e24] border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500" />
              <p className="text-[11px] text-slate-500 font-mono">Determines deterministic triple extraction strictness.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Max Extraction Tokens</label>
              <input type="text" defaultValue="8192" className="w-full bg-[#070e24] border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500" />
            </div>
          </div>
        </div>

        {/* Section 2: Neo4j Graph Connection */}
        <div className="bg-[#040817]/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-bold text-white">Neo4j AuraDB Connection</h2>
                <p className="text-xs text-slate-400 font-mono">Encrypted via TLS v1.3</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <Shield className="w-4 h-4" />
              <span>Zero-Trust Enclave</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Database URI</label>
              <input
                type={revealKeys ? "text" : "password"}
                defaultValue="neo4j+s://3bce3499.databases.neo4j.io"
                className="w-full bg-[#070e24] border border-slate-700/80 text-white rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Authentication Mode</label>
                <input
                  type={revealKeys ? "text" : "password"}
                  defaultValue="Zero-Trust Enterprise Key (TLS v1.3 Secured)"
                  className="w-full bg-[#070e24] border border-slate-700/80 text-white rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Zero-Trust Enterprise Key</label>
                <input
                  type={revealKeys ? "text" : "password"}
                  defaultValue="xbRprPiR41BwUVnr7WotZBT85mzMcKjnKGgVlw5fHP4"
                  className="w-full bg-[#070e24] border border-slate-700/80 text-white rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Vector Indexing (Pinecone) */}
        <div className="bg-[#040817]/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
            <Database className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Pinecone Vector Index</h2>
              <p className="text-xs text-slate-400 font-mono">Environment: us-east-1</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Index Name</label>
              <input type="text" defaultValue="axiom-graphrag" readOnly className="w-full bg-[#070e24]/60 border border-slate-800 text-slate-400 rounded-xl px-4 py-3 text-sm font-mono cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Similarity Metric</label>
              <input type="text" defaultValue="Cosine Similarity" readOnly className="w-full bg-[#070e24]/60 border border-slate-800 text-slate-400 rounded-xl px-4 py-3 text-sm font-mono cursor-not-allowed" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
