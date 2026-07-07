import { useState } from 'react';

export default function AuthPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError('');
    
    const endpoint = isSignUp 
      ? `${baseUrl}/api/Auth/register` 
      : `${baseUrl}/api/Auth/login`;
    const payload = isSignUp 
      ? { email, password, name } 
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const userData = await response.json();
        // Pass the rememberMe state back to App.jsx to handle storage logic
        onLogin({ ...userData, rememberMe }); 
      } else {
        const errorText = await response.text();
        setError(errorText || 'Authentication failed.');
      }
    } catch (err) {
      setError('Network error. Unable to reach the server.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-50 to-slate-200 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 rounded-full bg-indigo-200 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 rounded-full bg-blue-200 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl p-8 transition-all duration-300">
        <div className="text-center mb-8">
  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 mb-3">
    <svg className="w-6 h-6" fill="none" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" opacity="0.6">
        <line x1="3" y1="7" x2="21" y2="7" />
        <line x1="3" y1="12" x2="15" y2="12" />
      </g>
      <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth={2.6} />
      <line x1="20" y1="20" x2="25.5" y2="25.5" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" />
    </svg>
  </div>
  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
    {isSignUp ? 'Create your Account' : 'Welcome to Docket'}
  </h2>
  <p className="text-sm text-slate-500 mt-1">
    {isSignUp ? 'Find answers buried in your documents' : 'Read less. Know more.'}
  </p>
</div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
              {!isSignUp && (
                <a href="#forgot" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
              )}
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {!isSignUp && (
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isSignUp ? 'Sign up' : 'Sign in'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm rounded-lg shadow-xs transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button> */}

        <div className="text-center mt-8 text-sm">
          <span className="text-slate-500">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline focus:outline-none cursor-pointer"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}