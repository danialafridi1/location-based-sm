import { LogOut, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  user: {
    fullName: string;
    username: string;
    privacy: string;
    _id: string;
  } | null;
  loadingUser: boolean;
  errorUser: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, loadingUser, errorUser, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo + Branding */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SocialSphere
              </h1>
              <p className="text-xs text-gray-500 font-medium">Discover & Connect</p>
            </div>
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center space-x-3">
            {loadingUser ? (
              <div className="flex items-center space-x-2 bg-white/50 backdrop-blur px-4 py-2 rounded-full">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : errorUser ? (
              <span className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-full">
                {errorUser}
              </span>
            ) : (
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur border border-white/40 rounded-full px-5 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.fullName?.[0]?.toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="font-semibold text-gray-900 text-sm">{user?.fullName}</span>
                  <Link to={`/profile/${user?._id}`} className="text-xs text-indigo-600 hover:underline">
                    @{user?.username}
                  </Link>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    user?.privacy === "public"
                      ? "bg-green-100 text-green-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {user?.privacy}
                </span>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="group relative bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
