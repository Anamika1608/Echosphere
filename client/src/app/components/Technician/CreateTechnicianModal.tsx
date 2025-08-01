// components/community/CreateTechnicianModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const serverUrl = 'http://localhost:3000/api';

interface CreateTechnicianModalProps {
    communityId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateTechnicianModal: React.FC<CreateTechnicianModalProps> = ({
    communityId,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        speciality: 'GENERAL',
        isAvailable: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const specialities = [
        { value: 'PLUMBING', label: 'Plumbing' },
        { value: 'ELECTRICAL', label: 'Electrical' },
        { value: 'CARPENTRY', label: 'Carpentry' },
        { value: 'CLEANING', label: 'Cleaning' },
        { value: 'PAINTING', label: 'Painting' },
        { value: 'AC_REPAIR', label: 'AC Repair' },
        { value: 'APPLIANCE_REPAIR', label: 'Appliance Repair' },
        { value: 'GENERAL_MAINTENANCE', label: 'General Maintenance' }
    ];


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await axios.post(`${serverUrl}/technician`, {
                ...formData,
                pgCommunityId: communityId
            }, {
                withCredentials: true
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create technician');
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-[24px] p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Technician</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Technician'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTechnicianModal;