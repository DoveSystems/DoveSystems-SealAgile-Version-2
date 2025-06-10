import { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamMember, useProject } from '../contexts/ProjectContext';
import { FiEdit2 } from 'react-icons/fi';

type TeamMemberCardProps = {
  member: TeamMember;
};

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  const { updateTeamMember } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(member);

  const handleSave = () => {
    updateTeamMember(member.id, editedMember);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-4"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input
              type="text"
              className="input w-full"
              value={editedMember.name}
              onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Role</label>
            <input
              type="text"
              className="input w-full"
              value={editedMember.role}
              onChange={(e) => setEditedMember({ ...editedMember, role: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Capacity (hours per day)</label>
            <input
              type="number"
              className="input w-full"
              value={editedMember.capacity}
              onChange={(e) => setEditedMember({ ...editedMember, capacity: Number(e.target.value) })}
              min={0}
              max={24}
              step={0.5}
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Velocity Factor</label>
            <input
              type="number"
              className="input w-full"
              value={editedMember.velocityFactor}
              onChange={(e) => setEditedMember({ ...editedMember, velocityFactor: Number(e.target.value) })}
              min={0.1}
              max={2}
              step={0.1}
            />
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
      className="card p-4 hover:border-primary-800 transition-colors duration-200"
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{member.name}</h3>
            <p className="text-gray-400 text-sm">{member.role}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditing(true)}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors self-start"
        >
          <FiEdit2 size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">Daily Capacity</div>
          <div className="text-sm text-white">{member.capacity} hours</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-400 mb-1">Velocity Factor</div>
          <div className="text-sm text-white">{member.velocityFactor.toFixed(1)}x</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;
