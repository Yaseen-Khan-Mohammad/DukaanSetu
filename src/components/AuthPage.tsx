import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { UserRole } from '../types';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Store,
  UserCheck,
  BriefcaseBusiness,
  ArrowRight,
  RotateCcw,
  X,
} from 'lucide-react';

interface RoleTheme {
  label: string;
  shortLabel: string;
  tagline: string;
  demoUserId: string;
  pageBg: string;
  brandAccentText: string;
  softSurfaceBg: string;
  softSurfaceBorder: string;
  accentBg: string;
  accentHoverBg: string;
  accentText: string;
  accentBorder: string;
  focusRing: string;
  cardTopBorder: string;
  iconBg: string;
}

const ROLE_THEMES: Record<UserRole, RoleTheme> = {
  individual: {
    label: 'Individual Customer',
    shortLabel: 'Customer',
    tagline: 'Shop daily groceries & essentials at up to 60% off MRP.',
    demoUserId: 'user_cust_1',
    pageBg: 'bg-[#FAF0F2]/55',
    brandAccentText: 'text-[#B8556D]',
    softSurfaceBg: 'bg-[#FAF0F2]',
    softSurfaceBorder: 'border-[#F0D9DF]',
    accentBg: 'bg-[#B8556D]',
    accentHoverBg: 'hover:bg-[#A0445A]',
    accentText: 'text-[#B8556D]',
    accentBorder: 'border-[#B8556D]',
    focusRing: 'focus:ring-[#B8556D] focus:border-[#B8556D]',
    cardTopBorder: 'border-t-4 border-t-[#B8556D]',
    iconBg: 'bg-[#FAF0F2] text-[#B8556D]',
  },
  shop_owner: {
    label: 'Shop Owner',
    shortLabel: 'Shop Owner',
    tagline: 'List short-dated stock & recover inventory value fast.',
    demoUserId: 'user_shop_1',
    pageBg: 'bg-[#ECF7F3]/70',
    brandAccentText: 'text-[#1E6B52]',
    softSurfaceBg: 'bg-[#ECF7F3]',
    softSurfaceBorder: 'border-[#C6E6D9]',
    accentBg: 'bg-[#1E6B52]',
    accentHoverBg: 'hover:bg-[#16533F]',
    accentText: 'text-[#1E6B52]',
    accentBorder: 'border-[#1E6B52]',
    focusRing: 'focus:ring-[#1E6B52] focus:border-[#1E6B52]',
    cardTopBorder: 'border-t-4 border-t-[#1E6B52]',
    iconBg: 'bg-[#ECF7F3] text-[#1E6B52]',
  },
  business_buyer: {
    label: 'Business Buyer',
    shortLabel: 'Business Buyer',
    tagline: 'Procure bulk surplus ingredients for cafés, kitchens & catering.',
    demoUserId: 'user_biz_1',
    pageBg: 'bg-[#EEF3FA]/80',
    brandAccentText: 'text-[#2B4C7E]',
    softSurfaceBg: 'bg-[#EEF3FA]',
    softSurfaceBorder: 'border-[#CEDCEF]',
    accentBg: 'bg-[#2B4C7E]',
    accentHoverBg: 'hover:bg-[#203A63]',
    accentText: 'text-[#2B4C7E]',
    accentBorder: 'border-[#2B4C7E]',
    focusRing: 'focus:ring-[#2B4C7E] focus:border-[#2B4C7E]',
    cardTopBorder: 'border-t-4 border-t-[#2B4C7E]',
    iconBg: 'bg-[#EEF3FA] text-[#2B4C7E]',
  },
};

export const AuthPage: React.FC = () => {
  const { authenticateUser, registerUser, showToast, quickSwitchUser, resetPrototype } = useMarketplace();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Selected Role controls both theme and account role
  const [role, setRole] = useState<UserRole>('individual');

  // Sign In Form State (empty by default, no prefilled random email)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Form State
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');

  const [formError, setFormError] = useState('');

  const theme = ROLE_THEMES[role];

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole);
    setFormError('');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = loginEmail.trim();
    if (!trimmedEmail || !loginPassword) {
      setFormError('Please enter both your email address and password.');
      return;
    }

    const res = authenticateUser(trimmedEmail, loginPassword, role);
    if (!res.ok) {
      setFormError(res.error);
    }
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

    const res = registerUser({
      name: name.trim(),
      email: signupEmail.trim(),
      phone: phone.trim(),
      password: signupPassword,
      role,
      shopName: shopName.trim() || undefined,
      shopAddress: shopAddress.trim() || undefined,
    });

    if (!res.ok) {
      setFormError(res.error);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    showToast(`Password reset instructions sent to ${forgotEmail.trim()}`, 'info');
    setForgotPasswordOpen(false);
    setForgotEmail('');
  };

  const handleResetClick = () => {
    setRole('individual');
    setIsSignUp(false);
    setLoginEmail('');
    setLoginPassword('');
    setName('');
    setSignupEmail('');
    setPhone('');
    setSignupPassword('');
    setConfirmPassword('');
    setShopName('');
    setShopAddress('');
    setFormError('');
    setForgotPasswordOpen(false);
    resetPrototype();
  };

  const RoleIcon = role === 'shop_owner' ? Store : role === 'business_buyer' ? BriefcaseBusiness : UserCheck;

  return (
    <div className={`min-h-screen ${theme.pageBg} transition-colors duration-300 flex flex-col justify-between`}>
      {/* Top Bar for Auth */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#17212F] flex items-center justify-center text-white font-bold text-lg tracking-wider shadow-sm">
              DS
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#17212F]">
                Dukaan<span className={`${theme.brandAccentText} transition-colors duration-300`}>Setu</span>
              </span>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Neighborhood Short-Dated Inventory Marketplace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-stone-600 font-medium hidden md:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>FSSAI Compliant · Verified Stores Only</span>
            </div>

            <button
              type="button"
              onClick={handleResetClick}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors whitespace-nowrap"
              title="Reset all demo data and inputs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Prototype</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div
          className={`w-full max-w-lg bg-white rounded-xl shadow-sm border border-stone-200 ${theme.cardTopBorder} p-6 sm:p-8 transition-all duration-300`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${theme.iconBg} mb-3 transition-colors duration-300`}
            >
              <RoleIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#17212F] tracking-tight">
              Welcome to DukaanSetu
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Discover great deals. Reduce waste. Shop smarter.
            </p>
          </div>

          {/* Role Selector (Shifts Sign Page Theme & Sets Account Role) */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#17212F] uppercase tracking-wider">
                Select Your Role
              </span>
              <span className={`text-[11px] font-semibold ${theme.accentText} transition-colors duration-300`}>
                {theme.label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('individual')}
                className={`p-2.5 rounded-lg border text-center transition-all duration-200 flex flex-col items-center gap-1.5 ${
                  role === 'individual'
                    ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D] shadow-xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-[11px] font-semibold leading-tight">
                  Individual Customer
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('shop_owner')}
                className={`p-2.5 rounded-lg border text-center transition-all duration-200 flex flex-col items-center gap-1.5 ${
                  role === 'shop_owner'
                    ? 'border-[#1E6B52] bg-[#ECF7F3] text-[#1E6B52] shadow-xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="text-[11px] font-semibold leading-tight">
                  Shop Owner
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('business_buyer')}
                className={`p-2.5 rounded-lg border text-center transition-all duration-200 flex flex-col items-center gap-1.5 ${
                  role === 'business_buyer'
                    ? 'border-[#2B4C7E] bg-[#EEF3FA] text-[#2B4C7E] shadow-xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <BriefcaseBusiness className="w-5 h-5" />
                <span className="text-[11px] font-semibold leading-tight">
                  Business Buyer
                </span>
              </button>
            </div>
          </div>

          {/* Role Context & Instant Demo Access Banner */}
          <div
            className={`${theme.softSurfaceBg} border ${theme.softSurfaceBorder} rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors duration-300`}
          >
            <p className="text-xs text-stone-700 leading-snug">{theme.tagline}</p>
            <button
              type="button"
              onClick={() => quickSwitchUser(theme.demoUserId)}
              className={`shrink-0 py-1.5 px-3 bg-white hover:bg-stone-50 rounded-md text-xs font-semibold ${theme.accentText} border ${theme.softSurfaceBorder} transition-colors whitespace-nowrap`}
            >
              Demo {theme.shortLabel}
            </button>
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
                  placeholder="Enter your email address"
                  autoComplete="email"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 ${theme.focusRing} transition`}
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
                    className={`text-xs ${theme.accentText} hover:underline font-medium transition-colors`}
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
                    autoComplete="current-password"
                    className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 ${theme.focusRing} transition`}
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
                className={`w-full mt-2 py-3 px-4 ${theme.accentBg} ${theme.accentHoverBg} text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-300 flex items-center justify-center gap-2`}
              >
                <span>Sign In as {theme.shortLabel}</span>
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
                  className={`text-xs font-semibold ${theme.accentText} hover:underline transition-colors`}
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
                  placeholder="Enter your full name"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 ${theme.focusRing}`}
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
                    placeholder="Enter your email"
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 ${theme.focusRing}`}
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
                    placeholder="+91 98XXX XXXXX"
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 ${theme.focusRing}`}
                    required
                  />
                </div>
              </div>

              {/* If Shop Owner or Business Buyer, collect organization details */}
              {(role === 'shop_owner' || role === 'business_buyer') && (
                <div className={`p-3 ${theme.softSurfaceBg} border ${theme.softSurfaceBorder} rounded-lg space-y-2.5 transition-colors duration-300`}>
                  <div>
                    <label className="block text-xs font-semibold text-[#17212F] mb-1">
                      {role === 'shop_owner' ? 'Shop / Store Name *' : 'Business / Kitchen Name'}
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder={role === 'shop_owner' ? 'Enter your store name' : 'Enter your business name'}
                      className={`w-full px-3 py-1.5 text-sm rounded border border-stone-300 bg-white focus:outline-none focus:ring-1 ${theme.focusRing}`}
                      required={role === 'shop_owner'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17212F] mb-1">
                      {role === 'shop_owner' ? 'Store Address / Locality' : 'Business Address / Locality'}
                    </label>
                    <input
                      type="text"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      placeholder="Street, area, and city"
                      className={`w-full px-3 py-1.5 text-sm rounded border border-stone-300 bg-white focus:outline-none focus:ring-1 ${theme.focusRing}`}
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
                      className={`w-full px-3 py-2 pr-9 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 ${theme.focusRing}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                      className={`w-full px-3 py-2 pr-9 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 ${theme.focusRing}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full mt-2 py-3 px-4 ${theme.accentBg} ${theme.accentHoverBg} text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-300 flex items-center justify-center gap-2`}
              >
                <span>Register as {theme.shortLabel}</span>
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
                  className={`text-xs font-semibold ${theme.accentText} hover:underline transition-colors`}
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
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setForgotPasswordOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-[#17212F]">Reset Password</h3>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-600 mb-4">
              Enter your registered email address and we will send recovery instructions.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 ${theme.focusRing}`}
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
                  className={`flex-1 py-2 text-xs font-medium text-white ${theme.accentBg} ${theme.accentHoverBg} rounded-lg transition-colors`}
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
