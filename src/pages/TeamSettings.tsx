import { useState } from 'react';
import { FiUsers, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProject, TeamMember } from '../contexts/ProjectContext';
import PageTitle from '../components/PageTitle';
import { Dialog } from '@headlessui/react';

const TeamSettings = () => {
  const { project, updateTeamMember, addTeamMember, removeTeamMember } = useProject();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isDeleteMemberOpen, setIsDeleteMemberOpen] = useState(false);
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

  const handleDeleteMember = () => {
    if (!selectedMember) return;
    
    removeTeamMember(selectedMember.id);
    setSelectedMember(null);
    setIsDeleteMemberOpen(false);
  };

  const openEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditMemberOpen(true);
  };

  const openDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteMemberOpen(true);
  };

  return (
    <div>
      <PageTitle 
        title="Team Settings" 
        subtitle="Manage your team members and their roles"
        icon={<FiUsers size={24} />}
      />

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.team.map(member => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-5"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-900 text-primary-400 text-xl font-semibold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Capacity</span>
                <span className="text-white">{member.capacity} hours/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Velocity Factor</span>
                <span className="text-white">{member.velocityFactor}x</span>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button 
                className="btn btn-sm btn-outline flex-1"
                onClick={() => openEditMember(member)}
              >
                <FiEdit2 size={14} className="mr-1" />
                Edit
              </button>
              <button 
                className="btn btn-sm btn-outline btn-error flex-1"
                onClick={() => openDeleteMember(member)}
              >
                <FiTrash2 size={14} className="mr-1" />
                Remove
              </button>
            </div>
          </motion.div>
        ))}
        
        {project.team.length === 0 && (
          <div className="card p-8 text-center col-span-full">
            <p className="text-gray-400 mb-4">No team members yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsAddMemberOpen(true)}
            >
              <FiPlus className="mr-2" />
              Add Your First Team Member
            </button>
          </div>
        )}
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

      {/* Delete Member Modal */}
      <Dialog
        open={isDeleteMemberOpen}
        onClose={() => setIsDeleteMemberOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card p-6 max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Remove Team Member
            </Dialog.Title>
            
            <p className="text-gray-300 mb-4">
              Are you sure you want to remove <span className="text-white font-medium">{selectedMember?.name}</span> from the team? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="btn btn-outline"
                onClick={() => setIsDeleteMemberOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={handleDeleteMember}
              >
                Remove Member
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TeamSettings;
