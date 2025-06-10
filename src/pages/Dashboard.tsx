import { FiCalendar, FiTrendingUp, FiList, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProject } from '../contexts/ProjectContext';
import PageTitle from '../components/PageTitle';
import BurndownChart from '../components/BurndownChart';
import VelocityChart from '../components/VelocityChart';
import CapacityChart from '../components/CapacityChart';
import StoryCard from '../components/StoryCard';

const Dashboard = () => {
  const { project, getAverageVelocity } = useProject();

  if (!project) {
    return <div>Loading project data...</div>;
  }

  const currentSprint = project.sprints.find(sprint => 
    sprint.id === project.currentSprintId || sprint.status === 'active'
  );

  const backlogStories = project.stories
    .filter(story => story.status === 'backlog')
    .slice(0, 3);

  const sprintStories = currentSprint
    ? project.stories.filter(story => 
        currentSprint.stories.includes(story.id) && 
        story.status !== 'done'
      ).slice(0, 3)
    : [];

  const averageVelocity = getAverageVelocity(3);

  return (
    <div>
      <PageTitle 
        title="Dashboard" 
        subtitle="Overview of your current sprint and project metrics"
        icon={<FiCalendar size={24} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-primary-900/50 text-primary-400 mr-3">
              <FiCalendar size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Current Sprint</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name</span>
              <span className="text-white font-medium">{currentSprint?.name || 'No active sprint'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Goal</span>
              <span className="text-white font-medium">{currentSprint?.goal || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="text-white font-medium capitalize">{currentSprint?.status || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stories</span>
              <span className="text-white font-medium">{currentSprint?.stories.length || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-secondary-900/50 text-secondary-400 mr-3">
              <FiTrendingUp size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Velocity</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Average</span>
              <span className="text-white font-medium">{averageVelocity.toFixed(1)} points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Sprint</span>
              <span className="text-white font-medium">
                {project.sprints.find(s => s.status === 'completed') 
                  ? `${getAverageVelocity(1).toFixed(1)} points` 
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Trend</span>
              <span className="text-green-400 font-medium">+2.5 points</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-accent-900/50 text-accent-400 mr-3">
              <FiUsers size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Team</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Members</span>
              <span className="text-white font-medium">{project.team.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Capacity</span>
              <span className="text-white font-medium">
                {project.team.reduce((sum, member) => sum + member.capacity, 0)} hours/day
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg. Velocity Factor</span>
              <span className="text-white font-medium">
                {(project.team.reduce((sum, member) => sum + member.velocityFactor, 0) / project.team.length).toFixed(1)}x
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card"
        >
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Sprint Burndown</h3>
          </div>
          <div className="p-5">
            <BurndownChart sprintId={currentSprint?.id} height={250} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="card"
        >
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Velocity Trend</h3>
          </div>
          <div className="p-5">
            <VelocityChart height={250} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="card lg:col-span-2"
        >
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-gray-800 mr-3">
                <FiList className="text-primary-400" size={18} />
              </div>
              <h3 className="text-lg font-medium text-white">Current Sprint Stories</h3>
            </div>
            <a href="/sprint-planning" className="text-primary-400 hover:text-primary-300 text-sm">
              View All
            </a>
          </div>
          <div className="p-5">
            {sprintStories.length > 0 ? (
              <div className="space-y-4">
                {sprintStories.map(story => (
                  <StoryCard key={story.id} story={story} showActions={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No stories in current sprint</p>
                <a href="/sprint-planning" className="btn btn-outline mt-3">
                  Plan Sprint
                </a>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="card"
        >
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Capacity Allocation</h3>
          </div>
          <div className="p-5">
            <CapacityChart height={250} sprintId={currentSprint?.id} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
