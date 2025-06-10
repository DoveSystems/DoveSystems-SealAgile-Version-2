import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiCalendar, 
  FiList, 
  FiTrendingUp, 
  FiUsers, 
  FiSettings 
} from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
  { to: '/sprint-planning', icon: <FiCalendar size={20} />, label: 'Sprint Planning' },
  { to: '/backlog', icon: <FiList size={20} />, label: 'Backlog' },
  { to: '/velocity', icon: <FiTrendingUp size={20} />, label: 'Velocity' },
  { to: '/capacity', icon: <FiUsers size={20} />, label: 'Capacity' },
  { to: '/team-settings', icon: <FiSettings size={20} />, label: 'Team Settings' },
];

const Sidebar = () => {
  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-64 bg-gray-900/80 backdrop-blur-sm border-r border-gray-800 h-full flex flex-col"
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"
          >
            <span className="text-white text-xl font-bold">SA</span>
          </motion.div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-900/50 text-primary-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="card p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400">
              <FiTrendingUp size={16} />
            </div>
            <span className="text-sm font-medium text-gray-300">Sprint Progress</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <div className="text-xs text-gray-400">5 days remaining</div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
