import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { User, UserRole } from '../types';
import { Eye, EyeOff, ShieldCheck, Store, UserCheck, BriefcaseBusiness, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { setCurrentUser, setActiveView, showToast, quickSwitchUser } = useMarketplace();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('priya.sharma@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Sign Up Form State
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('individual');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');

  const [formError, setFormError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!loginEmail || !loginPassword) {
      setFormError('Please enter both email and password.');
      return;
    }

    // Authenticate demo account or create user session
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: loginEmail.includes('ramesh') ? 'Ramesh Patel' : loginEmail.includes('priya') ? 'Priya Sharma' : loginEmail.split('@')[0],
      email: loginEmail,
      phone: '+91 98450 12345',
      role: loginEmail.includes('ramesh') ? 'shop_owner' : 'individual',
      shopName: loginEmail.includes('ramesh') ? 'Krishna Daily Needs' : undefined,
    };

    setCurrentUser(newUser);
    setActiveView('marketplace');
    showToast(`Welcome back to DukaanSetu, ${newUser.name}!`);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !signupEmail.trim() || !phone.trim() || !signupPassword) {
      setFormError('All required fields must be filled.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setFormError('Passwords do not match. Please verify.');
      return;
    }

    if (signupPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (role === 'shop_owner' && !shopName.trim()) {
      setFormError('Please enter your Shop or Store name.');
      return;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: signupEmail.trim(),
      phone: phone.trim(),
      role,
      shopName: role === 'shop_owner' ? shopName.trim() : undefined,
      shopAddress: role === 'shop_owner' ? shopAddress.trim() : undefined,
    };

    setCurrentUser(newUser);
    setActiveView(role === 'shop_owner' ? 'sell' : 'marketplace');
    showToast(`Account registered successfully! Welcome, ${newUser.name}`);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    showToast(`Password reset link sent to ${forgotEmail}`, 'info');
    setForgotPasswordOpen(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] flex flex-col justify-between">
      {/* Top Bar for Auth */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#17212F] flex items-center justify-center text-white font-bold text-lg tracking-wider shadow-sm">
              DS
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#17212F]">
                Dukaan<span className="text-[#B8556D]">Setu</span>
              </span>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Neighborhood Short-Dated Inventory Marketplace
              </p>
            </div>
          </div>
          <div className="text-xs text-stone-600 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>FSSAI Compliant · Verified Stores Only</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF0F2] text-[#B8556D] mb-3">
              <Store className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#17212F] tracking-tight">
              Welcome to DukaanSetu
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Discover great deals. Reduce waste. Shop smarter.
            </p>
          </div>

          {/* Quick Demo Switcher Strip */}
          <div className="bg-[#FAF0F2] border border-[#F0D9DF] rounded-lg p-3 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#17212F]">Instant Demo Access:</span>
              <span className="text-[11px] text-stone-500">Click to preview role</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickSwitchUser('user_cust_1')}
                className="py-1.5 px-2 bg-white rounded text-xs font-medium text-[#17212F] hover:bg-stone-50 border border-stone-200 transition-colors text-center"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => quickSwitchUser('user_shop_1')}
                className="py-1.5 px-2 bg-white rounded text-xs font-medium text-[#B8556D] hover:bg-stone-50 border border-stone-200 transition-colors text-center font-semibold"
              >
                Shop Owner
              </button>
              <button
                type="button"
                onClick={() => quickSwitchUser('user_biz_1')}
                className="py-1.5 px-2 bg-white rounded text-xs font-medium text-[#17212F] hover:bg-stone-50 border border-stone-200 transition-colors text-center"
              >
                Business Buyer
              </button>
            </div>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {formError}
            </div>
          )}

          {!isSignUp ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D] focus:border-[#B8556D] transition"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-xs text-[#B8556D] hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D] focus:border-[#B8556D] transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-[#B8556D] hover:bg-[#A0445A] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In to Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-3 border-t border-stone-100">
                <span className="text-xs text-stone-600">New to DukaanSetu? </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setFormError('');
                  }}
                  className="text-xs font-semibold text-[#B8556D] hover:underline"
                >
                  Create an Account
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up / Registration Form */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="ramesh@dukaan.com"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    required
                  />
                </div>
              </div>

              {/* Account Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('individual')}
                    className={`p-2.5 rounded-lg border text-left transition flex flex-col items-center gap-1.5 ${
                      role === 'individual'
                        ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D]'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <UserCheck className="w-5 h-5" />
                    <span className="text-[11px] font-semibold text-center leading-tight">
                      Individual Customer
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('shop_owner')}
                    className={`p-2.5 rounded-lg border text-left transition flex flex-col items-center gap-1.5 ${
                      role === 'shop_owner'
                        ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D]'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                    <span className="text-[11px] font-semibold text-center leading-tight">
                      Shop Owner
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('business_buyer')}
                    className={`p-2.5 rounded-lg border text-left transition flex flex-col items-center gap-1.5 ${
                      role === 'business_buyer'
                        ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D]'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <BriefcaseBusiness className="w-5 h-5" />
                    <span className="text-[11px] font-semibold text-center leading-tight">
                      Business Buyer
                    </span>
                  </button>
                </div>
              </div>

              {/* If Shop Owner, collect shop information */}
              {role === 'shop_owner' && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#17212F] mb-1">
                      Shop / Store Name *
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Krishna Daily Needs & Dairy"
                      className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#B8556D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17212F] mb-1">
                      Store Address / Locality
                    </label>
                    <input
                      type="text"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
                      className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#B8556D]"
                    />
                  </div>
                </div>
              )}

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 pr-9 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full px-3 py-2 pr-9 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-[#B8556D] hover:bg-[#A0445A] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 border-t border-stone-100">
                <span className="text-xs text-stone-600">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setFormError('');
                  }}
                  className="text-xs font-semibold text-[#B8556D] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-[#17212F] mb-1">Reset Password</h3>
            <p className="text-xs text-stone-600 mb-4">
              Enter your registered email address and we'll send you recovery instructions.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="flex-1 py-2 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-medium text-white bg-[#B8556D] rounded-lg hover:bg-[#A0445A]"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-stone-200 bg-white text-center text-xs text-stone-500">
        <p>© 2026 DukaanSetu Retail Technologies Private Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};
