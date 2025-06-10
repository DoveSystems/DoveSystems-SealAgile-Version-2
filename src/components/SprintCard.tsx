import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprint, Story, useProject } from '../contexts/ProjectContext';
import { FiCalendar, FiTarget, FiEdit2 } from 'react-icons/fi';
import StoryCard from './StoryCard';

type SprintCardProps = {
  sprint: Sprint;
  stories: Story[];
};

const SprintCard = ({ sprint, stories }: SprintCardProps) => {
  const { updateSprint } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSprint, setEditedSprint] = useState(sprint);

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusColors = {
    planning: 'bg-blue-500/20 text-blue-400',
    active: 'bg-green-500/20 text-green-400',
    completed: 'bg-purple-500/20 text-purple-400'
  };

  const totalPoints = stories.reduce((sum, story) => sum + story.points, 0);
  const completedPoints = stories
    .filter(story => story.status === 'done')
    .reduce((sum, story) => sum + story.points, 0);
  
  const progressPercentage = stories.length > 0 
    ? Math.round((completedPoints / totalPoints) * 100) 
    : 0;

  const handleSave = () => {
    updateSprint(sprint.id, editedSprint);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-5 mb-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Sprint Name</label>
            <input
              type="text"
              className="input w-full"
              value={editedSprint.name}
              onChange={(e) => setEditedSprint({ ...editedSprint, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Sprint Goal</label>
            <textarea
              className="input w-full"
              value={editedSprint.goal}
              onChange={(e) => setEditedSprint({ ...editedSprint, goal: e.target.value })}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                className="input w-full"
                value={editedSprint.startDate.split('T')[0]}
                onChange={(e) => setEditedSprint({ 
                  ...editedSprint, 
                  startDate: new Date(e.target.value).toISOString() 
                })}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                className="input w-full"
                value={editedSprint.endDate.split('T')[0]}
                onChange={(e) => setEditedSprint({ 
                  ...editedSprint, 
                  endDate: new Date(e.target.value).toISOString() 
                })}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <select
                className="input w-full"
                value={editedSprint.status}
                onChange={(e) => setEditedSprint({ 
                  ...editedSprint, 
                  status: e.target.value as SprintStatus 
                })}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Capacity (Story Points)</label>
            <input
              type="number"
              className="input w-full"
              value={editedSprint.capacity}
              onChange={(e) => setEditedSprint({ 
                ...editedSprint, 
                capacity: Number(e.target.value) 
              })}
              min={1}
            />
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              className="btn btn-outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card mb-6 overflow-visible"
    >
      <div className="p-5 border-b border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-white">{sprint.name}</h3>
              <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[sprint.status]}`}>
                {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-400 mt-1">{sprint.goal}</p>
          </div>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <FiEdit2 size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-gray-800 mr-3">
              <FiCalendar className="text-primary-400" size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Duration</div>
              <div className="text-sm text-white">
                {formatDate(startDate)} - {formatDate(endDate)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-gray-800 mr-3">
              <FiTarget className="text-secondary-400" size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Capacity</div>
              <div className="text-sm text-white">
                {sprint.capacity} story points
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-400 mb-1">Progress</div>
            <div className="flex items-center">
              <div className="w-full bg-gray-800 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-white">{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h4 className="text-md font-medium text-gray-300 mb-4">Stories ({stories.length})</h4>
        
        {stories.length > 0 ? (
          <div className="space-y-3">
            {stories.map(story => (
              <StoryCard key={story.id} story={story} showActions={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No stories added to this sprint yet.</p>
            <button className="btn btn-outline mt-3">Add Stories</button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SprintCard;
