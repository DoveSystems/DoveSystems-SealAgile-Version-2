import { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProject, Sprint, Story } from '../contexts/ProjectContext';
import PageTitle from '../components/PageTitle';
import SprintCard from '../components/SprintCard';
import StoryCard from '../components/StoryCard';
import { Dialog } from '@headlessui/react';

const SprintPlanning = () => {
  const { project, addSprint, moveStoryToSprint } = useProject();
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [newSprint, setNewSprint] = useState<Omit<Sprint, 'id' | 'createdAt'>>({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    capacity: 24,
    stories: []
  });
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [isMoveStoriesOpen, setIsMoveStoriesOpen] = useState(false);

  useEffect(() => {
    // Initialize dates for new sprint
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1); // Start tomorrow
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13); // 2 weeks sprint
    
    setNewSprint(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  }, []);

  if (!project) {
    return <div>Loading project data...</div>;
  }

  const backlogStories = project.stories.filter(story => 
    story.status === 'backlog' && 
    !project.sprints.some(sprint => sprint.stories.includes(story.id))
  );

  const handleCreateSprint = () => {
    addSprint({
      ...newSprint,
      startDate: new Date(newSprint.startDate).toISOString(),
      endDate: new Date(newSprint.endDate).toISOString(),
    });
    
    setNewSprint({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
      status: 'planning',
      capacity: 24,
      stories: []
    });
    
    setIsCreateSprintOpen(false);
  };

  const handleToggleStorySelection = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const handleMoveStories = () => {
    if (!selectedSprintId) return;
    
    selectedStories.forEach(storyId => {
      moveStoryToSprint(storyId, selectedSprintId);
    });
    
    setSelectedStories([]);
    setIsMoveStoriesOpen(false);
  };

  const getSprintStories = (sprintId: string): Story[] => {
    const sprint = project.sprints.find(s => s.id === sprintId);
    if (!sprint) return [];
    
    return project.stories.filter(story => sprint.stories.includes(story.id));
  };

  return (
    <div>
      <PageTitle 
        title="Sprint Planning" 
        subtitle="Plan and manage your sprints"
        icon={<FiCalendar size={24} />}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Sprints</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setIsCreateSprintOpen(true)}
        >
          <FiPlus className="mr-2" />
          Create Sprint
        </button>
      </div>

      <div className="space-y-6 mb-10">
        {project.sprints.map(sprint => (
          <SprintCard 
            key={sprint.id} 
            sprint={sprint} 
            stories={getSprintStories(sprint.id)} 
          />
        ))}
        
        {project.sprints.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-gray-400 mb-4">No sprints created yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsCreateSprintOpen(true)}
            >
              <FiPlus className="mr-2" />
              Create Your First Sprint
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Backlog</h2>
        <div className="flex space-x-3">
          {selectedStories.length > 0 && (
            <button 
              className="btn btn-outline"
              onClick={() => setIsMoveStoriesOpen(true)}
            >
              <FiArrowRight className="mr-2" />
              Move to Sprint ({selectedStories.length})
            </button>
          )}
          <button className="btn btn-primary">
            <FiPlus className="mr-2" />
            Add Story
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {backlogStories.map(story => (
          <div 
            key={story.id} 
            className={`border-2 rounded-lg transition-colors ${
              selectedStories.includes(story.id) 
                ? 'border-primary-500' 
                : 'border-transparent'
            }`}
            onClick={() => handleToggleStorySelection(story.id)}
          >
            <StoryCard 
              story={story} 
              onMoveToSprint={() => {
                setSelectedStories([story.id]);
                setIsMoveStoriesOpen(true);
              }} 
            />
          </div>
        ))}
        
        {backlogStories.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-gray-400 mb-4">No stories in the backlog.</p>
            <button className="btn btn-primary">
              <FiPlus className="mr-2" />
              Create Story
            </button>
          </div>
        )}
      </div>

      {/* Create Sprint Modal */}
      <Dialog
        open={isCreateSprintOpen}
        onClose={() => setIsCreateSprintOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card p-6 max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Create New Sprint
            </Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sprint Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g., Sprint 2"
                  value={newSprint.name}
                  onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sprint Goal</label>
                <textarea
                  className="input w-full"
                  placeholder="What do you want to achieve in this sprint?"
                  value={newSprint.goal}
                  onChange={(e) => setNewSprint({ ...newSprint, goal: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="input w-full"
                    value={newSprint.startDate}
                    onChange={(e) => setNewSprint({ ...newSprint, startDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    className="input w-full"
                    value={newSprint.endDate}
                    onChange={(e) => setNewSprint({ ...newSprint, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Capacity (Story Points)</label>
                <input
                  type="number"
                  className="input w-full"
                  value={newSprint.capacity}
                  onChange={(e) => setNewSprint({ ...newSprint, capacity: Number(e.target.value) })}
                  min={1}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="btn btn-outline"
                onClick={() => setIsCreateSprintOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateSprint}
                disabled={!newSprint.name || !newSprint.startDate || !newSprint.endDate}
              >
                Create Sprint
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Move Stories Modal */}
      <Dialog
        open={isMoveStoriesOpen}
        onClose={() => setIsMoveStoriesOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card p-6 max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Move Stories to Sprint
            </Dialog.Title>
            
            <p className="text-gray-400 mb-4">
              Select a sprint to move {selectedStories.length} {selectedStories.length === 1 ? 'story' : 'stories'} to:
            </p>
            
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {project.sprints.map(sprint => (
                <div 
                  key={sprint.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSprintId === sprint.id 
                      ? 'bg-primary-900/50 border border-primary-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedSprintId(sprint.id)}
                >
                  <div className="font-medium text-white">{sprint.name}</div>
                  <div className="text-sm text-gray-400">{sprint.goal}</div>
                </div>
              ))}
              
              {project.sprints.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No sprints available.</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn btn-outline"
                onClick={() => setIsMoveStoriesOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleMoveStories}
                disabled={!selectedSprintId}
              >
                Move Stories
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default SprintPlanning;
