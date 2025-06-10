import { useState } from 'react';
import { FiUsers, FiPlus, FiEdit2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProject, TeamMember } from '../contexts/ProjectContext';
import PageTitle from '../components/PageTitle';
import CapacityChart from '../components/CapacityChart';
import { Dialog } from '@headlessui/react';

const Capacity = () => {
  const { project, updateTeamMember, addTeamMember } = useProject();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    capacity: 6,
    velocityFactor: 1.0,
    avatar: ''
  });

  if (!project) {
    return <div>Loading project data...</div>;
  }

  const currentSprint = project.sprints.find(sprint => 
    sprint.id === project.currentSprintId || sprint.status === 'active'
  );

  const totalCapacity = project.team.reduce((sum, member) => sum + member.capacity, 0);
  const averageVelocityFactor = project.team.length > 0 
    ? project.team.reduce((sum, member) => sum + member.velocityFactor, 0) / project.team.length 
    : 0;

  const handleAddMember = () => {
    addTeamMember(newMember);
    setNewMember({
      name: '',
      role: '',
      capacity: 6,
      velocityFactor: 1.0,
      avatar: ''
    });
    setIsAddMemberOpen(false);
  };

  const handleEditMember = () => {
    if (!selectedMember) return;
    
    updateTeamMember(selectedMember.id, selectedMember);
    setSelectedMember(null);
    setIsEditMemberOpen(false);
  };

  const openEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditMemberOpen(true);
  };

  return (
    <div>
      <PageTitle 
        title="Capacity Planning" 
        subtitle="Manage your team's capacity and allocation"
        icon={<FiUsers size={24} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-primary-900/50 text-primary-400 mr-3">
              <FiUsers size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Team Size</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {project.team.length}
            <span className="text-sm font-normal text-gray-400 ml-1">members</span>
          </div>
          <p className="text-gray-400 text-sm">
            {project.team.length > 0 
              ? `${project.team.filter(m => m.role === 'Developer').length} developers, ${project.team.filter(m => m.role !== 'Developer').length} others`
              : 'No team members yet'}
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
              <FiUsers size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Total Capacity</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {totalCapacity}
            <span className="text-sm font-normal text-gray-400 ml-1">hours/day</span>
          </div>
          <p className="text-gray-400 text-sm">
            {project.team.length > 0 
              ? `${(totalCapacity * 5).toFixed(0)} hours per week`
              : 'No team members yet'}
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
              <FiUsers size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Avg. Velocity Factor</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {averageVelocityFactor.toFixed(1)}x
          </div>
          <p className="text-gray-400 text-sm">
            {project.team.length > 0 
              ? `Team efficiency multiplier`
              : 'No team members yet'}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card"
        >
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Capacity Allocation</h3>
          </div>
          <div className="p-5">
            <CapacityChart height={300} sprintId={currentSprint?.id} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card"
        >
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Sprint Capacity</h3>
          </div>
          <div className="p-5">
            {currentSprint ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Sprint</span>
                    <span className="text-white font-medium">{currentSprint.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">
                      {Math.ceil((new Date(currentSprint.endDate).getTime() - new Date(currentSprint.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Working Days</span>
                    <span className="text-white font-medium">
                      {Math.floor((new Date(currentSprint.endDate).getTime() - new Date(currentSprint.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7) * 5)} days
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Total Team Capacity</span>
                    <span className="text-white font-medium">
                      {totalCapacity * Math.floor((new Date(currentSprint.endDate).getTime() - new Date(currentSprint.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7) * 5)} hours
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Estimated Story Points</span>
                    <span className="text-white font-medium">
                      {project.stories
                        .filter(story => currentSprint.stories.includes(story.id))
                        .reduce((sum, story) => sum + story.points, 0)} points
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Hours per Point</span>
                    <span className="text-white font-medium">
                      {(totalCapacity * Math.floor((new Date(currentSprint.endDate).getTime() - new Date(currentSprint.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7) * 5) / 
                        (project.stories
                          .filter(story => currentSprint.stories.includes(story.id))
                          .reduce((sum, story) => sum + story.points, 0) || 1)).toFixed(1)} hours
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active sprint</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Team Members</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddMemberOpen(true)}
        >
          <FiPlus className="mr-2" />
          Add Team Member
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left text-gray-400 font-medium">Member</th>
                <th className="p-4 text-left text-gray-400 font-medium">Role</th>
                <th className="p-4 text-left text-gray-400 font-medium">Capacity (hours/day)</th>
                <th className="p-4 text-left text-gray-400 font-medium">Velocity Factor</th>
                <th className="p-4 text-left text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.team.length > 0 ? (
                project.team.map(member => (
                  <tr key={member.id} className="border-b border-gray-800">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 mr-3 overflow-hidden">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-900 text-primary-400">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-white">{member.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{member.role}</td>
                    <td className="p-4 text-white">{member.capacity} hours</td>
                    <td className="p-4 text-white">{member.velocityFactor}x</td>
                    <td className="p-4">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => openEditMember(member)}
                      >
                        <FiEdit2 size={14} className="mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No team members yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <Dialog
        open={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card p-6 max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Add Team Member
            </Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Enter name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select
                  className="input w-full"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                >
                  <option value="">Select role</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Product Owner">Product Owner</option>
                  <option value="Scrum Master">Scrum Master</option>
                  <option value="QA Engineer">QA Engineer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Capacity (hours/day)
                </label>
                <input
                  type="number"
                  className="input w-full"
                  min={1}
                  max={8}
                  value={newMember.capacity}
                  onChange={(e) => setNewMember({ ...newMember, capacity: Number(e.target.value) })}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Velocity Factor
                </label>
                <input
                  type="number"
                  className="input w-full"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={newMember.velocityFactor}
                  onChange={(e) => setNewMember({ ...newMember, velocityFactor: Number(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  1.0 is baseline. Higher values indicate higher productivity.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="btn btn-outline"
                onClick={() => setIsAddMemberOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddMember}
                disabled={!newMember.name || !newMember.role}
              >
                Add Member
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Member Modal */}
      <Dialog
        open={isEditMemberOpen}
        onClose={() => setIsEditMemberOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card p-6 max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Edit Team Member
            </Dialog.Title>
            
            {selectedMember && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    className="input w-full"
                    value={selectedMember.name}
                    onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <select
                    className="input w-full"
                    value={selectedMember.role}
                    onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                  >
                    <option value="">Select role</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Product Owner">Product Owner</option>
                    <option value="Scrum Master">Scrum Master</option>
                    <option value="QA Engineer">QA Engineer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Capacity (hours/day)
                  </label>
                  <input
                    type="number"
                    className="input w-full"
                    min={1}
                    max={8}
                    value={selectedMember.capacity}
                    onChange={(e) => setSelectedMember({ ...selectedMember, capacity: Number(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Velocity Factor
                  </label>
                  <input
                    type="number"
                    className="input w-full"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={selectedMember.velocityFactor}
                    onChange={(e) => setSelectedMember({ ...selectedMember, velocityFactor: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    1.0 is baseline. Higher values indicate higher productivity.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="btn btn-outline"
                onClick={() => setIsEditMemberOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleEditMember}
                disabled={!selectedMember?.name || !selectedMember?.role}
              >
                Save Changes
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Capacity;
