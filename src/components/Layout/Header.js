import React, { useState } from "react";
import {
  Heart,
  Bell,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  User as UserIcon,
  Cog
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const Header = () => {
  const { state, dispatch } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dark, setDark] = useState(false);

  const notifications = [
    { id: 1, text: "New donation received: $100", unread: true },
    { id: 2, text: "Campaign 'Food Relief' 75% funded", unread: false },
    { id: 3, text: "Monthly report ready to view", unread: true }
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Theme toggle logic
  const toggleTheme = () => {
    setDark(d => {
      if (!d) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return !d;
    });
  };

  // Close dropdowns on click elsewhere (basic)
  React.useEffect(() => {
    const listener = () => {
      setShowNotif(false);
      setShowUserMenu(false);
    };
    window.addEventListener("click", listener);
    return () => window.removeEventListener("click", listener);
  }, []);

  // Prevent dropdown closing on click inside
  const stop = e => e.stopPropagation();

  // Logout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">DonationHub</h1>
              <span className="text-xs text-gray-500 dark:text-gray-300">Admin Dashboard</span>
            </div>
          </div>
          
          {/* Right items */}
          <div className="flex items-center space-x-4 relative">
            {/* Theme toggle */}
            <button
              className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-yellow-300 rounded-full transition"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={e => { e.stopPropagation(); toggleTheme(); }}
            >
              {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition relative"
                onClick={e => { stop(e); setShowNotif(s => !s); }}
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded z-50 py-2"
                  onClick={stop}
                >
                  <div className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 border-b">Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-2 flex text-sm ${n.unread ? "bg-blue-50 dark:bg-blue-900 font-bold" : ""}`}>
                      {n.text}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-gray-400 text-center">No new notifications</div>
                  )}
                </div>
              )}
            </div>
            {/* User menu */}
            <div className="relative">
              <button
                className="flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 py-1 pl-2 pr-2 rounded transition"
                onClick={e => { stop(e); setShowUserMenu(s => !s); }}
              >
                <div className="mr-2">
                  <UserIcon className="h-6 w-6 text-indigo-600 dark:text-yellow-400" />
                </div>
                <span className="hidden sm:block text-gray-700 dark:text-gray-100 font-medium text-sm mr-1">
                  {state.currentUser?.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded w-48 py-2 z-50"
                  onClick={stop}
                >
                  <div className="px-4 py-2 text-gray-700 dark:text-gray-200 border-b">
                    <div className="font-bold">{state.currentUser?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{state.currentUser?.role}</div>
                  </div>
                  <button className="flex w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 items-center">
                    <Cog className="h-4 w-4 mr-2" /> Profile Settings
                  </button>
                  <button
                    className="flex w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
