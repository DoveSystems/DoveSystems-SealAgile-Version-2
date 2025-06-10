import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type SprintStatus = 'planning' | 'active' | 'completed';

export type Story = {
  id: string;
  title: string;
  description: string;
  points: number;
  priority: 'low' | 'medium' | 'high';
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  assignee?: string;
  createdAt: string;
};

export type Sprint = {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  capacity: number;
  stories: string[]; // Story IDs
  createdAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  capacity: number;
  velocityFactor: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  team: TeamMember[];
  sprints: Sprint[];
  stories: Story[];
  currentSprintId?: string;
  createdAt: string;
};

type ProjectContextType = {
  project: Project | null;
  setProject: (project: Project) => void;
  createProject: (name: string, description: string) => void;
  addSprint: (sprint: Omit<Sprint, 'id' | 'createdAt'>) => void;
  updateSprint: (sprintId: string, updates: Partial<Sprint>) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt'>) => void;
  updateStory: (storyId: string, updates: Partial<Story>) => void;
  moveStoryToSprint: (storyId: string, sprintId: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (memberId: string) => void;
  getSprintVelocity: (sprintId: string) => number;
  getAverageVelocity: (sprintCount?: number) => number;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Sample data for initial project
const createInitialProject = (): Project => {
  const now = new Date();
  const sprintStart = new Date();
  sprintStart.setDate(now.getDate() + 1);
  
  const sprintEnd = new Date(sprintStart);
  sprintEnd.setDate(sprintStart.getDate() + 13);
  
  const sprintId = uuidv4();
  
  return {
    id: uuidv4(),
    name: 'My Agile Project',
    description: 'A sample project to demonstrate SealAgile capabilities',
    team: [
      {
        id: uuidv4(),
        name: 'Alex Chen',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Alex',
        role: 'Product Owner',
        capacity: 8,
        velocityFactor: 1.0
      },
      {
        id: uuidv4(),
        name: 'Jordan Smith',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Jordan',
        role: 'Scrum Master',
        capacity: 6,
        velocityFactor: 0.8
      },
      {
        id: uuidv4(),
        name: 'Taylor Wong',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Taylor',
        role: 'Developer',
        capacity: 10,
        velocityFactor: 1.2
      }
    ],
    sprints: [
      {
        id: sprintId,
        name: 'Sprint 1',
        goal: 'Deliver core functionality',
        startDate: sprintStart.toISOString(),
        endDate: sprintEnd.toISOString(),
        status: 'planning',
        capacity: 24,
        stories: [],
        createdAt: now.toISOString()
      }
    ],
    stories: [
      {
        id: uuidv4(),
        title: 'User authentication',
        description: 'Implement user login and registration',
        points: 5,
        priority: 'high',
        status: 'backlog',
        createdAt: now.toISOString()
      },
      {
        id: uuidv4(),
        title: 'Dashboard layout',
        description: 'Create responsive dashboard layout',
        points: 3,
        priority: 'medium',
        status: 'backlog',
        createdAt: now.toISOString()
      },
      {
        id: uuidv4(),
        title: 'API integration',
        description: 'Connect to backend API endpoints',
        points: 8,
        priority: 'high',
        status: 'backlog',
        createdAt: now.toISOString()
      }
    ],
    currentSprintId: sprintId,
    createdAt: now.toISOString()
  };
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [project, setProjectState] = useState<Project | null>(() => {
    const savedProject = localStorage.getItem('sealAgileProject');
    return savedProject ? JSON.parse(savedProject) : null;
  });

  useEffect(() => {
    if (project) {
      localStorage.setItem('sealAgileProject', JSON.stringify(project));
    } else {
      localStorage.removeItem('sealAgileProject');
    }
  }, [project]);

  const setProject = (projectData: Project) => {
    setProjectState(projectData);
  };

  const createProject = (name: string, description: string) => {
    const newProject = {
      ...createInitialProject(),
      name,
      description
    };
    setProjectState(newProject);
  };

  const addSprint = (sprintData: Omit<Sprint, 'id' | 'createdAt'>) => {
    if (!project) return;
    
    const newSprint: Sprint = {
      ...sprintData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    setProjectState({
      ...project,
      sprints: [...project.sprints, newSprint]
    });
  };

  const updateSprint = (sprintId: string, updates: Partial<Sprint>) => {
    if (!project) return;
    
    const updatedSprints = project.sprints.map(sprint => 
      sprint.id === sprintId ? { ...sprint, ...updates } : sprint
    );
    
    setProjectState({
      ...project,
      sprints: updatedSprints
    });
  };

  const addStory = (storyData: Omit<Story, 'id' | 'createdAt'>) => {
    if (!project) return;
    
    const newStory: Story = {
      ...storyData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    setProjectState({
      ...project,
      stories: [...project.stories, newStory]
    });
  };

  const updateStory = (storyId: string, updates: Partial<Story>) => {
    if (!project) return;
    
    const updatedStories = project.stories.map(story => 
      story.id === storyId ? { ...story, ...updates } : story
    );
    
    setProjectState({
      ...project,
      stories: updatedStories
    });
  };

  const moveStoryToSprint = (storyId: string, sprintId: string) => {
    if (!project) return;
    
    // Find the sprint that currently contains the story
    const currentSprint = project.sprints.find(sprint => 
      sprint.stories.includes(storyId)
    );
    
    // Remove the story from its current sprint
    let updatedSprints = project.sprints;
    if (currentSprint) {
      updatedSprints = project.sprints.map(sprint => 
        sprint.id === currentSprint.id 
          ? { ...sprint, stories: sprint.stories.filter(id => id !== storyId) }
          : sprint
      );
    }
    
    // Add the story to the new sprint
    updatedSprints = updatedSprints.map(sprint => 
      sprint.id === sprintId 
        ? { ...sprint, stories: [...sprint.stories, storyId] }
        : sprint
    );
    
    setProjectState({
      ...project,
      sprints: updatedSprints
    });
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    if (!project) return;
    
    const newMember: TeamMember = {
      ...memberData,
      id: uuidv4()
    };
    
    setProjectState({
      ...project,
      team: [...project.team, newMember]
    });
  };

  const updateTeamMember = (memberId: string, updates: Partial<TeamMember>) => {
    if (!project) return;
    
    const updatedTeam = project.team.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    );
    
    setProjectState({
      ...project,
      team: updatedTeam
    });
  };

  const removeTeamMember = (memberId: string) => {
    if (!project) return;

    setProjectState({
      ...project,
      team: project.team.filter(member => member.id !== memberId)
    });
  };

  const getSprintVelocity = (sprintId: string): number => {
    if (!project) return 0;
    
    const sprint = project.sprints.find(s => s.id === sprintId);
    if (!sprint) return 0;
    
    return sprint.stories.reduce((total, storyId) => {
      const story = project.stories.find(s => s.id === storyId);
      if (story && story.status === 'done') {
        return total + story.points;
      }
      return total;
    }, 0);
  };

  const getAverageVelocity = (sprintCount?: number): number => {
    if (!project) return 0;
    
    const completedSprints = project.sprints
      .filter(sprint => sprint.status === 'completed')
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    
    if (completedSprints.length === 0) return 0;
    
    const sprintsToConsider = sprintCount 
      ? completedSprints.slice(0, sprintCount) 
      : completedSprints;
    
    const totalVelocity = sprintsToConsider.reduce(
      (sum, sprint) => sum + getSprintVelocity(sprint.id), 
      0
    );
    
    return totalVelocity / sprintsToConsider.length;
  };

  return (
    <ProjectContext.Provider value={{
      project,
      setProject,
      createProject,
      addSprint,
      updateSprint,
      addStory,
      updateStory,
      moveStoryToSprint,
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      getSprintVelocity,
      getAverageVelocity
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
