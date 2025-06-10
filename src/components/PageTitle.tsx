import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type PageTitleProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
};

const PageTitle = ({ title, subtitle, icon, actions }: PageTitleProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center"
      >
        {icon && (
          <div className="mr-4 p-3 rounded-lg bg-primary-900/50 text-primary-400">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{title}</h1>
          {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </motion.div>
      
      {actions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
};

export default PageTitle;
