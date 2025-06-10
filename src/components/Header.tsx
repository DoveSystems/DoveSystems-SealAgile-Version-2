import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useProject } from '../contexts/ProjectContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, clearUser } = useUser();
  const { project } = useProject();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <span className="text-xl font-display font-semibold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 text-transparent bg-clip-text">
                SealAgile
              </span>
            </motion.div>
          </div>
          {project && (
            <div className="hidden md:block">
              <span className="text-gray-400">|</span>
              <span className="ml-4 text-gray-200 font-medium">{project.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500 p-0.5">
                <img
                  src={user?.avatar.image}
                  alt={user?.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="hidden md:block text-gray-200">{user?.name}</span>
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
