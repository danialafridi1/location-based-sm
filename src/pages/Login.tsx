import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
setIsLoading(true);
    try {
        const response = await login(email, password);
     console.log("Login response:", response); // should log { message, data: { token } }

    const token = response.data?.token; // <-- correct path
    if (!token) throw new Error("Token not found in response");

    localStorage.setItem("token", token);
    console.log("Token saved:", localStorage.getItem("token")); // verify
setIsLoading(false);
      navigate("/");
    } catch (err: any) {
      setIsLoading(false);
      setError(err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side - Branding */}
          <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in-left">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-50"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-3xl">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                SocialSphere
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-md">
              Connect with friends, share your moments, and discover amazing content in a whole new way.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-200">Secure</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-gray-200">Fast</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-gray-200">Modern</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md animate-fade-in-right">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              
              {/* Form Card */}
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                  <p className="text-gray-300">Enter your credentials to continue</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm animate-shake">
                    <p className="text-red-200 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-200 flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <div className="relative group/input">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover/input:opacity-100 transition pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-200 flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </label>
                    <div className="relative group/input">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover/input:opacity-100 transition pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer group/check">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0" />
                      <span className="text-gray-300 group-hover/check:text-white transition">Remember me</span>
                    </label>
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition font-semibold">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group/btn relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-semibold py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/5 text-gray-400 rounded-full backdrop-blur-sm">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 transition backdrop-blur-sm group/social">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="text-white"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="text-white"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="text-white"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="text-white"/>
                    </svg>
                    <span className="text-white font-medium">Google</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 transition backdrop-blur-sm group/social">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-white font-medium">GitHub</span>
                  </button>
                </div>

                {/* Sign Up Link */}
                <p className="mt-8 text-center text-gray-300">
                  Don't have an account?{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;