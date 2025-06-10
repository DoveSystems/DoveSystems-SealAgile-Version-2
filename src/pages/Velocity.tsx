import { useState } from 'react';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProject } from '../contexts/ProjectContext';
import PageTitle from '../components/PageTitle';
import VelocityChart from '../components/VelocityChart';

const Velocity = () => {
  const { project, getAverageVelocity } = useProject();
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'last3', 'last6'

  if (!project) {
    return <div>Loading project data...</div>;
  }

  const completedSprints = project.sprints.filter(sprint => 
    sprint.status === 'completed'
  );

  const getVelocityData = () => {
    let sprints = completedSprints;
    
    if (timeRange === 'last3') {
      sprints = completedSprints.slice(-3);
    } else if (timeRange === 'last6') {
      sprints = completedSprints.slice(-6);
    }
    
    return sprints;
  };

  const velocityData = getVelocityData();
  const averageVelocity = getAverageVelocity(timeRange === 'last3' ? 3 : timeRange === 'last6' ? 6 : undefined);

  return (
    <div>
      <PageTitle 
        title="Velocity" 
        subtitle="Track and analyze your team's velocity over time"
        icon={<FiTrendingUp size={24} />}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Velocity Analysis</h2>
        <div className="flex space-x-2">
          <button 
            className={`btn ${timeRange === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
          <button 
            className={`btn ${timeRange === 'last6' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('last6')}
          >
            Last 6 Sprints
          </button>
          <button 
            className={`btn ${timeRange === 'last3' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('last3')}
          >
            Last 3 Sprints
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-primary-900/50 text-primary-400 mr-3">
              <FiTrendingUp size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Average Velocity</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {averageVelocity.toFixed(1)}
            <span className="text-sm font-normal text-gray-400 ml-1">points/sprint</span>
          </div>
          <p className="text-gray-400 text-sm">
            Based on {velocityData.length} completed sprint{velocityData.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-secondary-900/50 text-secondary-400 mr-3">
              <FiTrendingUp size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Highest Velocity</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {velocityData.length > 0 
              ? Math.max(...velocityData.map(sprint => {
                  const sprintStories = project.stories.filter(story => 
                    sprint.stories.includes(story.id) && story.status === 'done'
                  );
                  return sprintStories.reduce((sum, story) => sum + story.points, 0);
                })).toFixed(0)
              : '0'}
            <span className="text-sm font-normal text-gray-400 ml-1">points</span>
          </div>
          <p className="text-gray-400 text-sm">
            {velocityData.length > 0 
              ? `Achieved in ${velocityData.reduce((highest, sprint, i) => {
                  const points = project.stories
                    .filter(story => sprint.stories.includes(story.id) && story.status === 'done')
                    .reduce((sum, story) => sum + story.points, 0);
                  return points > highest.points ? { name: sprint.name, points } : highest;
                }, { name: '', points: 0 }).name}`
              : 'No completed sprints yet'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-accent-900/50 text-accent-400 mr-3">
              <FiCalendar size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Velocity Trend</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {velocityData.length >= 2 
              ? (((velocityData[velocityData.length - 1].stories.reduce((sum, storyId) => {
                  const story = project.stories.find(s => s.id === storyId && s.status === 'done');
                  return sum + (story ? story.points : 0);
                }, 0)) / 
                (velocityData[velocityData.length - 2].stories.reduce((sum, storyId) => {
                  const story = project.stories.find(s => s.id === storyId && s.status === 'done');
                  return sum + (story ? story.points : 0);
                }, 0) || 1) - 1) * 100).toFixed(1)
              : '0.0'}%
          </div>
          <p className="text-gray-400 text-sm">
            {velocityData.length >= 2 
              ? `Compared to previous sprint`
              : 'Not enough data to calculate trend'}
          </p>
        </motion.div>
      </div>

      <div className="card mb-8">
        <div className="p-5 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">Velocity Chart</h3>
        </div>
        <div className="p-5">
          <VelocityChart height={350} timeRange={timeRange} />
        </div>
      </div>

      <div className="card">
        <div className="p-5 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">Sprint Velocity History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left text-gray-400 font-medium">Sprint</th>
                <th className="p-4 text-left text-gray-400 font-medium">Date Range</th>
                <th className="p-4 text-left text-gray-400 font-medium">Completed Points</th>
                <th className="p-4 text-left text-gray-400 font-medium">Committed Points</th>
                <th className="p-4 text-left text-gray-400 font-medium">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {velocityData.length > 0 ? (
                velocityData.map(sprint => {
                  const sprintStories = project.stories.filter(story => 
                    sprint.stories.includes(story.id)
                  );
                  const completedPoints = sprintStories
                    .filter(story => story.status === 'done')
                    .reduce((sum, story) => sum + story.points, 0);
                  const committedPoints = sprintStories
                    .reduce((sum, story) => sum + story.points, 0);
                  const completionRate = committedPoints > 0 
                    ? (completedPoints / committedPoints * 100).toFixed(0) 
                    : '0';
                  
                  return (
                    <tr key={sprint.id} className="border-b border-gray-800">
                      <td className="p-4 text-white">{sprint.name}</td>
                      <td className="p-4 text-gray-300">
                        {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-white font-medium">{completedPoints} points</td>
                      <td className="p-4 text-gray-300">{committedPoints} points</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary-500 h-2 rounded-full" 
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-white">{completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No completed sprints yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Velocity;
