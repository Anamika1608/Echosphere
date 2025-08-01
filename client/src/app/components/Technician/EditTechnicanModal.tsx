// components/community/EditTechnicianModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const serverUrl = 'http://localhost:3000/api';

interface Technician {
  id: string;
  name: string;
  phoneNumber: string;
  speciality: string;
  isAvailable: boolean;
}

interface EditTechnicianModalProps {
  technician: Technician;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTechnicianModal: React.FC<EditTechnicianModalProps> = ({
  technician,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: technician.name,
    phoneNumber: technician.phoneNumber,
    speciality: technician.speciality,
    isAvailable: technician.isAvailable
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const specialities = [
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'CLEANING', label: 'Cleaning' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'SECURITY', label: 'Security' },
    { value: 'GARDENING', label: 'Gardening' },
    { value: 'PAINTING', label: 'Painting' },
    { value: 'CARPENTRY', label: 'Carpentry' },
    { value: 'GENERAL', label: 'General' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.put(`${serverUrl}/technician/${technician.id}`, formData, {
        withCredentials: true
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update technician');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Technician</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors"
              placeholder="Enter technician name"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-1">
              Speciality *
            </label>
            <select
              id="speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors"
            >
              {specialities.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-[#FF4500] focus:ring-[#FF4500] border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
              Available for assignments
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#FF4500] border border-transparent rounded-2xl hover:bg-[#E03E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Technician'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTechnicianModal;