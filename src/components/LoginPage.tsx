import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/dfd';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Key,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Shield,
  Layers,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    register,
    quickLoginAs,
    requestPasswordReset,
    resetPassword,
  } = useApp();

  // Variant switcher: 'editorial' (1 / 2) vs 'centered' (2 / 2)
  const [variant, setVariant] = useState<'editorial' | 'centered'>('centered');
  const [showVariantMenu, setShowVariantMenu] = useState(false);

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Credentials
  const [email, setEmail] = useState('admin@flowhire.io');
  const [password, setPassword] = useState('password123');

  // Register Modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('RECRUITER');
  const [regDepartment, setRegDepartment] = useState('Talent Acquisition');
  const [regTitle, setRegTitle] = useState('Senior Technical Recruiter');

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to authenticate');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        title: regTitle,
        department: regDepartment,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to register account');
      } else {
        setShowRegisterModal(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerResetToken = async () => {
    if (!resetEmail) {
      setResetStatus('Please enter your account email.');
      return;
    }
    const res = await requestPasswordReset(resetEmail);
    if (res.resetToken) {
      setGeneratedToken(res.resetToken);
      setResetTokenInput(res.resetToken);
      setResetStatus(`Security token generated: ${res.resetToken}`);
    } else {
      setResetStatus('Reset request submitted. Check token below.');
    }
  };

  const handleApplyNewPassword = async () => {
    if (!resetTokenInput || !newPasswordInput) {
      setResetStatus('Enter reset token and new password.');
      return;
    }
    const res = await resetPassword(resetTokenInput, newPasswordInput);
    if (res.success) {
      setSuccessMessage('Password reset successfully! Please sign in with your new password.');
      setShowResetModal(false);
      setPassword(newPasswordInput);
      setEmail(resetEmail || email);
    } else {
      setResetStatus(res.error || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-between p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#73adf5]/30 selection:text-white relative overflow-x-hidden">
      {/* Top Bar with Master All-Modules Access Pill */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between z-20 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#73adf5] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#73adf5]/30">
            TB
          </div>
          <span className="text-sm font-bold text-white tracking-tight">TalentBridge</span>
        </div>

        {/* Master Access Quick Trigger */}
        <button
          type="button"
          onClick={() => quickLoginAs('MASTER_ALL')}
          className="px-3.5 py-1.5 rounded-full bg-[#182436] hover:bg-[#20314a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md border border-[#2d3f59] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#73adf5]" />
          <span>Access All Modules</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full flex-1 flex items-center justify-center py-4 z-10">
        {/* ========================================================================= */}
        {/* VARIANT 1: EDITORIAL SPLIT                                               */}
        {/* ========================================================================= */}
        {variant === 'editorial' && (
          <div className="w-full max-w-[430px] bg-[#182436] border border-[#24364e] rounded-[30px] shadow-2xl overflow-hidden transition-all animate-fadeIn flex flex-col">
            {/* Top Blue Hero Banner with Ripple Graphics */}
            <div className="relative p-6 sm:p-7 bg-gradient-to-b from-[#18559e] via-[#12427e] to-[#0d3466] overflow-hidden text-white border-b border-[#1c487c]">
              {/* Concentric subtle decorative arcs */}
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/10 pointer-events-none"></div>
              <div className="absolute -top-6 -right-6 w-52 h-52 rounded-full border border-white/10 pointer-events-none"></div>
              <div className="absolute top-8 right-8 w-40 h-40 rounded-full border border-white/10 pointer-events-none"></div>

              {/* Logo Badge */}
              <div className="relative flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-[#182436] text-sm shadow-sm">
                  T
                </div>
                <span className="font-bold text-base tracking-tight text-white">TalentBridge</span>
              </div>

              {/* Tagline & Headline */}
              <div className="relative space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200 font-bold">
                  RECRUITMENT, MADE CLEARER
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  Find the right people.<br />Build what comes next.
                </h1>
                <p className="text-xs text-blue-100/90 leading-relaxed pt-1">
                  One place for vacancies, applications and the conversations that move hiring forward.
                </p>
              </div>
            </div>

            {/* Bottom Form Section on #182436 Blue Background */}
            <div className="p-6 sm:p-7 space-y-4 bg-[#182436]">
              <div className="flex items-center justify-end">
                <span className="text-xs text-[#8f9fad]">
                  New to TalentBridge?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="text-[#5396eb] hover:text-[#73adf5] font-semibold transition-colors"
                  >
                    Create an account
                  </button>
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-xs text-[#8f9fad] mt-0.5">Sign in to continue to your account.</p>
              </div>

              {/* Banners */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>{successMessage}</div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                {/* Email field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5] transition-colors"
                  />
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl pl-3.5 pr-14 py-2.5 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-xs text-[#8f9fad] hover:text-white transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 text-[#c2d0e2] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#2d3f59] bg-[#182436] text-[#73adf5] focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowResetModal(true);
                    }}
                    className="text-[#5396eb] hover:text-[#73adf5] transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#73adf5] hover:bg-[#5b9df2] disabled:opacity-50 rounded-xl transition-all shadow-md shadow-[#73adf5]/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              {/* Subtext info */}
              <p className="text-[11px] text-[#8091a4] text-center leading-relaxed pt-2">
                Job seeker and employer accounts can register online. Recruiter and administrator accounts are set up by an administrator.
              </p>

              {/* Footer */}
              <div className="pt-3 border-t border-[#223348] flex items-center justify-center gap-3 text-[11px] text-[#8091a4]">
                <button type="button" className="hover:text-slate-300 transition-colors">Privacy</button>
                <span>·</span>
                <button type="button" className="hover:text-slate-300 transition-colors">Help</button>
                <span>·</span>
                <span>© 2026 TalentBridge</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VARIANT 2: CENTERED CARD (Exact Match to image_5fb25b58.png)              */}
        {/* ========================================================================= */}
        {variant === 'centered' && (
          <div className="w-full max-w-[430px] bg-[#182436] border border-[#24364e] rounded-[30px] shadow-2xl p-6 sm:p-8 space-y-5 transition-all animate-fadeIn">
            {/* Logo Badge Centered */}
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-bold text-[#182436] text-sm shadow-md">
                T
              </div>
              <span className="font-bold text-base tracking-tight text-white">TalentBridge</span>
            </div>

            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
              <p className="text-xs text-[#8f9fad]">Sign in to manage your recruitment journey.</p>
            </div>

            {/* Feedback Banners */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5] transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl pl-3.5 pr-14 py-2.5 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-xs text-[#8f9fad] hover:text-white transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-[#c2d0e2] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#2d3f59] bg-[#182436] text-[#73adf5] focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowResetModal(true);
                  }}
                  className="text-[#5396eb] hover:text-[#73adf5] transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button (#73adf5) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#73adf5] hover:bg-[#5b9df2] disabled:opacity-50 rounded-xl transition-all shadow-md shadow-[#73adf5]/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Create account link */}
            <div className="text-center text-xs text-[#8f9fad]">
              New to TalentBridge?{' '}
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="text-[#5396eb] hover:text-[#73adf5] font-semibold transition-colors"
              >
                Create an account
              </button>
            </div>

            <div className="pt-2 border-t border-[#223348]">
              <p className="text-[11px] text-[#8091a4] text-center leading-relaxed">
                Recruiter and administrator accounts are created by your system administrator.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-[#8091a4]">
              <button type="button" className="hover:text-slate-300 transition-colors">Privacy</button>
              <button type="button" className="hover:text-slate-300 transition-colors">Help</button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Bottom Layout Switcher (Matches `< 2 / 2 Centered card ^ >` in image)     */}
      {/* ========================================================================= */}
      <div className="relative z-30 pt-4 pb-2">
        <div className="flex items-center gap-1.5 bg-[#181818] border border-[#2d2d2d] rounded-full px-3 py-1.5 shadow-xl text-xs text-[#8a8a8a] backdrop-blur-md">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={() => setVariant(variant === 'editorial' ? 'centered' : 'editorial')}
            className="p-1 text-[#7d7d7d] hover:text-white transition-colors"
            title="Previous layout"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Current Layout Label & Toggle */}
          <button
            type="button"
            onClick={() => setShowVariantMenu(!showVariantMenu)}
            className="flex items-center gap-1.5 px-2 py-0.5 hover:text-white transition-colors font-medium font-mono text-[11px]"
          >
            <span>
              {variant === 'editorial' ? '1 / 2' : '2 / 2'}{' '}
              <span className="font-sans font-semibold text-white">
                {variant === 'editorial' ? 'Editorial split' : 'Centered card'}
              </span>
            </span>
            <ChevronUp className={`w-3 h-3 text-[#7d7d7d] transition-transform ${showVariantMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={() => setVariant(variant === 'editorial' ? 'centered' : 'editorial')}
            className="p-1 text-[#7d7d7d] hover:text-white transition-colors"
            title="Next layout"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropdown Menu to pick layout */}
        {showVariantMenu && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#182436] border border-[#24364e] rounded-2xl p-2 shadow-2xl w-60 z-40 animate-fadeIn space-y-1 text-xs">
            <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Select Login Design:
            </div>
            <button
              type="button"
              onClick={() => {
                setVariant('editorial');
                setShowVariantMenu(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                variant === 'editorial'
                  ? 'bg-[#73adf5] text-white font-semibold'
                  : 'text-slate-300 hover:bg-[#1f2f45]'
              }`}
            >
              <span>1 / 2 Editorial split</span>
              <span className="text-[10px] font-mono opacity-80">Banner + Form</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setVariant('centered');
                setShowVariantMenu(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                variant === 'centered'
                  ? 'bg-[#73adf5] text-white font-semibold'
                  : 'text-slate-300 hover:bg-[#1f2f45]'
              }`}
            >
              <span>2 / 2 Centered card</span>
              <span className="text-[10px] font-mono opacity-80">Clean Card</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Self-Serve Register Modal                                                 */}
      {/* ========================================================================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#182436] border border-[#24364e] rounded-[24px] max-w-md w-full p-6 shadow-2xl relative my-8 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#223348]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#73adf5]/20 text-[#73adf5] flex items-center justify-center font-bold">
                  TB
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create an Account</h3>
                  <p className="text-xs text-[#8f9fad]">Join the TalentBridge platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Liam Vance"
                  className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. liam.vance@example.com"
                  className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#73adf5]"
                  >
                    <option value="RECRUITER">Recruiter</option>
                    <option value="EMPLOYER">Employer</option>
                    <option value="JOB_SEEKER">Job Seeker</option>
                    <option value="MANAGEMENT">Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#223348] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#73adf5] hover:bg-[#5b9df2] rounded-xl transition-all shadow-md shadow-[#73adf5]/20"
                >
                  {isLoading ? 'Creating...' : 'Register Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Self-Serve Forgot Password Modal                                          */}
      {/* ========================================================================= */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#182436] border border-[#24364e] rounded-[24px] max-w-md w-full p-6 shadow-2xl relative animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#223348]">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#73adf5]" />
                <h3 className="text-sm font-bold text-white">Reset Account Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8f9fad] leading-relaxed">
              Enter your email address to generate an authorized password reset token, then configure your new password.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Registered Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. admin@flowhire.io"
                    className="flex-1 bg-[#182436] border border-[#2d3f59] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5]"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerResetToken}
                    className="px-3 py-2 text-xs font-semibold bg-[#223348] hover:bg-[#2b415c] text-white rounded-xl transition-colors whitespace-nowrap border border-[#2d3f59]"
                  >
                    Generate Token
                  </button>
                </div>
              </div>

              {generatedToken && (
                <div className="p-2.5 rounded-lg bg-blue-950/60 border border-[#2d3f59] text-[11px] font-mono text-[#73adf5]">
                  Active Reset Token: <span className="font-bold">{generatedToken}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Reset Token
                </label>
                <input
                  type="text"
                  value={resetTokenInput}
                  onChange={(e) => setResetTokenInput(e.target.value)}
                  placeholder="RST-XXXXX"
                  className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-[#182436] border border-[#2d3f59] rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-[#6b7f9b] focus:outline-none focus:border-[#73adf5]"
                />
              </div>

              {resetStatus && (
                <div className="text-[11px] text-[#8f9fad] bg-[#141e2e] p-2 rounded-lg border border-[#2d3f59]">
                  {resetStatus}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#223348] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyNewPassword}
                className="px-4 py-2 text-xs font-bold text-white bg-[#73adf5] hover:bg-[#5b9df2] rounded-xl transition-colors shadow-sm"
              >
                Set New Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
