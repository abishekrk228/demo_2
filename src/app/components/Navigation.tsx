import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Learn', href: '/learn' },
  { label: 'Errors', href: '/errors' },
  { label: 'Atlas', href: '/atlas-platform' },
  { label: 'Docs', href: '/docs' },
  { label: 'Community', href: '/community' },
  { label: 'Pricing', href: '/pricing' },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'rgba(255,255,255,0.08)',
        boxShadow: '0 4px 30px rgba(15, 23, 42, 0.15)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo-vertical-dark.png"
              alt="TapeItOut Logo"
              className="w-8 h-8 rounded object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-white text-sm font-semibold tracking-wide">Ask</span>
              <span className="text-xs font-medium" style={{ color: 'var(--meridian-gold)', letterSpacing: '0.12em' }}>TAPEITOUT</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm rounded transition-colors"
                style={{
                  color: location.pathname === link.href ? 'var(--meridian-gold)' : 'rgba(243,242,237,0.7)',
                  fontWeight: location.pathname === link.href ? '500' : '400',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">


            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/atlas"
                  className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    background: 'var(--meridian-gold)',
                    color: 'var(--abyss-ink)',
                  }}
                >
                  Atlas AI
                </Link>
                {/* Profile Picture Link */}
                <Link
                  to="/profile"
                  className="shrink-0 flex items-center justify-center relative group"
                  title="View Profile"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.2)] object-cover group-hover:border-[#D4AF37] transition-all"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-full border border-[#D4AF37]/45 flex items-center justify-center font-mono text-xs font-bold text-[#D4AF37] group-hover:border-[#D4AF37] transition-all"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(15, 23, 42, 0.4) 100%)'
                      }}
                    >
                      {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden md:block text-sm px-3 py-1.5 rounded transition-colors hover:text-red-400 cursor-pointer"
                  style={{ color: 'rgba(243,242,237,0.7)' }}
                >
                  Sign Out
                </button>
              </div>

            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block text-sm px-4 py-1.5 rounded transition-colors"
                  style={{ color: 'rgba(243,242,237,0.7)' }}
                >
                  Sign In
                </Link>

                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-all"
                  style={{
                    background: 'var(--meridian-gold)',
                    color: 'var(--abyss-ink)',
                  }}
                >
                  Start Routing
                </Link>
              </>
            )}

            <button
              className="md:hidden p-2 rounded"
              style={{ color: 'rgba(243,242,237,0.7)' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>



        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t py-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-2 py-2.5 text-sm"
                style={{ color: 'rgba(243,242,237,0.7)' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t flex flex-col gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-1.5 border-b pb-3 mb-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-9 h-9 rounded-full border border-[#D4AF37]/50 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div 
                        className="w-9 h-9 rounded-full border border-[#D4AF37]/45 flex items-center justify-center font-mono text-xs font-bold text-[#D4AF37]"
                        style={{
                          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(15, 23, 42, 0.4) 100%)'
                        }}
                      >
                        {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-xs font-semibold truncate max-w-[150px]">
                        {user.user_metadata?.full_name || 'Member'}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 truncate max-w-[150px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="text-left text-sm px-2 py-2 text-white/70 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/atlas"
                    className="px-4 py-2 rounded text-sm font-medium text-center"
                    style={{ background: 'var(--meridian-gold)', color: 'var(--abyss-ink)' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Go to Atlas AI
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="text-left text-sm px-2 py-2 text-red-400 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>

              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm px-2 py-2"
                    style={{ color: 'rgba(243,242,237,0.7)' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded text-sm font-medium text-center"
                    style={{ background: 'var(--meridian-gold)', color: 'var(--abyss-ink)' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Start Routing
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
