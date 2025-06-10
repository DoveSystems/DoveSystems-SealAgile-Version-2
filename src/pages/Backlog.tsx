import { useState } from 'react';
import { FiList, FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProject, Story } from '../contexts/ProjectContext';
import PageTitle from '../components/PageTitle';
import StoryCard from '../components/StoryCard';

const Backlog = () => {
  const { project, addStory } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [newStory, setNewStory] = useState<Omit<Story, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    points: 3,
    priority: 'medium',
    status: 'backlog',
    assignee: undefined
  });

  if (!project) {
    return <div>Loading project data...</div>;
  }

  const backlogStories = project.stories.filter(story => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = !filterStatus || story.status === filterStatus;
    
    // Filter by priority
    const matchesPriority = !filterPriority || story.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateStory = () => {
    // Implementation will be added later
    console.log('Creating story:', newStory);
  };

  return (
    <div>
      <PageTitle 
        title="Backlog" 
        subtitle="Manage your product backlog and user stories"
        icon={<FiList size={24} />}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stories..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <button className="btn btn-outline flex items-center">
              <FiFilter className="mr-2" />
              Filter
            </button>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => setIsCreateStoryOpen(true)}
          >
            <FiPlus className="mr-2" />
            Add Story
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {backlogStories.map(story => (
          <StoryCard 
            key={story.id} 
            story={story} 
            showActions={true}
          />
        ))}
        
        {backlogStories.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-gray-400 mb-4">No stories found in the backlog.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsCreateStoryOpen(true)}
            >
              <FiPlus className="mr-2" />
              Create Your First Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Backlog;
