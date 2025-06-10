import { useState } from 'react';
import { motion } from 'framer-motion';
import { Story, useProject } from '../contexts/ProjectContext';
import { FiEdit2, FiTrash2, FiArrowRight } from 'react-icons/fi';

type StoryCardProps = {
  story: Story;
  showActions?: boolean;
  onMoveToSprint?: (storyId: string) => void;
};

const StoryCard = ({ story, showActions = true, onMoveToSprint }: StoryCardProps) => {
  const { updateStory } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState(story);

  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400'
  };

  const statusColors = {
    backlog: 'bg-gray-500/20 text-gray-400',
    todo: 'bg-purple-500/20 text-purple-400',
    'in-progress': 'bg-blue-500/20 text-blue-400',
    review: 'bg-yellow-500/20 text-yellow-400',
    done: 'bg-green-500/20 text-green-400'
  };

  const handleSave = () => {
    updateStory(story.id, editedStory);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-4 mb-4"
      >
        <div className="space-y-3">
          <input
            type="text"
            className="input w-full"
            value={editedStory.title}
            onChange={(e) => setEditedStory({ ...editedStory, title: e.target.value })}
          />
          
          <textarea
            className="input w-full"
            value={editedStory.description}
            onChange={(e) => setEditedStory({ ...editedStory, description: e.target.value })}
            rows={3}
          />
          
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Points</label>
              <select
                className="input"
                value={editedStory.points}
                onChange={(e) => setEditedStory({ ...editedStory, points: Number(e.target.value) })}
              >
                {[1, 2, 3, 5, 8, 13, 21].map(point => (
                  <option key={point} value={point}>{point}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Priority</label>
              <select
                className="input"
                value={editedStory.priority}
                onChange={(e) => setEditedStory({ ...editedStory, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <select
                className="input"
                value={editedStory.status}
                onChange={(e) => setEditedStory({ ...editedStory, status: e.target.value as any })}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-3">
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
      className="card p-4 mb-4 hover:border-primary-800 transition-colors duration-200"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-white">{story.title}</h3>
        
        {showActions && (
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <FiEdit2 size={16} />
            </button>
            {onMoveToSprint && (
              <button 
                onClick={() => onMoveToSprint(story.id)}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                title="Move to Sprint"
              >
                <FiArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      
      <p className="text-gray-400 text-sm mt-2 mb-3">{story.description}</p>
      
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900/50 text-primary-400">
          {story.points} {story.points === 1 ? 'point' : 'points'}
        </span>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[story.priority]}`}>
          {story.priority.charAt(0).toUpperCase() + story.priority.slice(1)} Priority
        </span>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[story.status]}`}>
          {story.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </div>
    </motion.div>
  );
};

export default StoryCard;
