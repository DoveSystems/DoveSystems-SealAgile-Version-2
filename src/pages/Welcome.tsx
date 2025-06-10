import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useUser, Avatar } from '../contexts/UserContext';
import { useProject } from '../contexts/ProjectContext';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const avatars: Avatar[] = [
  { id: '1', name: 'Fox', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Fox&backgroundColor=4f46e5' },
  { id: '2', name: 'Panda', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Panda&backgroundColor=0d9488' },
  { id: '3', name: 'Tiger', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tiger&backgroundColor=a21caf' },
  { id: '4', name: 'Wolf', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Wolf&backgroundColor=4338ca' },
  { id: '5', name: 'Owl', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owl&backgroundColor=14b8a6' },
  { id: '6', name: 'Bear', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bear&backgroundColor=d946ef' },
  { id: '7', name: 'Koala', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Koala&backgroundColor=6366f1' },
  { id: '8', name: 'Penguin', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Penguin&backgroundColor=0f766e' },
];

const Welcome = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { project, createProject } = useProject();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user already exists, redirect to dashboard
    if (user && project) {
      navigate('/dashboard');
    }
  }, [user, project, navigate]);

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim() || !selectedAvatar) return;
      setStep(2);
    } else if (step === 2) {
      if (!projectName.trim()) return;
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !selectedAvatar) return;
    
    setIsLoading(true);
    
    // Create user
    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      avatar: selectedAvatar,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    
    // Create project
    createProject(
      projectName.trim() || 'My Agile Project',
      projectDescription.trim() || 'A project created with SealAgile'
    );
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-8">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mr-3">
            <span className="text-white text-lg font-bold">SA</span>
          </div>
          <span className="text-xl font-display font-semibold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 text-transparent bg-clip-text">
            SealAgile
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                {step === 1 ? 'Welcome to SealAgile' : 'Create Your Project'}
              </h1>
              <p className="text-gray-400">
                {step === 1 
                  ? 'Choose your avatar and enter your name to get started' 
                  : 'Set up your first agile project'}
              </p>
            </div>

            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select an Avatar
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {avatars.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar)}
                        className={`relative rounded-lg p-1 transition-all duration-200 ${
                          selectedAvatar?.id === avatar.id
                            ? 'bg-primary-500/20 ring-2 ring-primary-500'
                            : 'hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden">
                          <img
                            src={avatar.image}
                            alt={avatar.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {selectedAvatar?.id === avatar.id && (
                          <div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-1">
                            <FiCheck size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="input w-full"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Agile Project"
                    className="input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description (Optional)
                  </label>
                  <textarea
                    id="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project"
                    className="input w-full"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={handleNextStep}
                disabled={isLoading || (step === 1 && (!name.trim() || !selectedAvatar))}
                className={`btn w-full flex items-center justify-center space-x-2 ${
                  isLoading || (step === 1 && (!name.trim() || !selectedAvatar))
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{step === 1 ? 'Continue' : 'Get Started'}</span>
                    <FiArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              SealAgile - Futuristic Sprint Planning Tool
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Welcome;
