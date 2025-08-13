import React, { useState } from 'react';
import { pgCommunityService } from '../../../services/pgCommunityService';
import type { PgCommunity, UpdatePgCommunityData } from '../../../types/pgCommunity';

interface EditPgCommunityFormProps {
    community: PgCommunity;
    onSuccess: () => void;
    onCancel: () => void;
}

const EditPgCommunityForm: React.FC<EditPgCommunityFormProps> = ({ community, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<UpdatePgCommunityData>({
        name: community.name,
        address: community.address,
        description: community.description || ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.name && formData.name.trim().length < 2) {
            newErrors.name = 'PG name must be at least 2 characters long';
        } else if (formData.name && formData.name.length > 100) {
            newErrors.name = 'PG name cannot exceed 100 characters';
        }

        if (formData.address && formData.address.trim().length < 5) {
            newErrors.address = 'Address must be at least 5 characters long';
        } else if (formData.address && formData.address.length > 500) {
            newErrors.address = 'Address cannot exceed 500 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description cannot exceed 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await pgCommunityService.updatePgCommunity(community.id, {
                ...formData,
                description: formData.description?.trim() || undefined
            });
            onSuccess();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update community';
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white/50 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Edit PG Community</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Error Display */}
                {errors.submit && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4">
                        <div className="text-red-800 text-sm">{errors.submit}</div>
                    </div>
                )}

                {/* Content */}
                <div className="mb-6">
                    <p className="text-gray-600 text-sm">
                        Update your PG community information and settings.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            PG Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 ${
                                errors.name 
                                    ? 'border-red-300 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-[#FF4500]'
                            }`}
                            placeholder="Enter PG name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 ${
                                errors.address 
                                    ? 'border-red-300 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-[#FF4500]'
                            }`}
                            placeholder="Enter complete address"
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 resize-none ${
                                errors.description 
                                    ? 'border-red-300 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-[#FF4500]'
                            }`}
                            placeholder="Optional description about your PG"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                </form>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
                    <div className="text-sm text-gray-600">
                        Update your community information
                    </div>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#FF4500] border border-transparent rounded-2xl hover:bg-[#E03E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Updating...' : 'Update Community'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPgCommunityForm