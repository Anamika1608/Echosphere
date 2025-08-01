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
        <div className= "min-h-screen pt-10 px-6 pb-8 w-full " style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFFAF3 67.31%,#FFFAF3 100%)' }}>
            <button
                    onClick={onCancel}
                    className="text-gray-700 hover:text-gray-600 pb-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    ✕
                </button>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit PG Community</h2>
                
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="text-red-800 text-sm">{errors.submit}</div>
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        PG Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-1 bg-white/70 focus:ring-[#FF703C] ${errors.name ? 'border-red-300' : 'border-gray-200'
                            }`}
                        placeholder="Enter PG name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-1 bg-white/70 focus:ring-[#FF703C] ${errors.name ? 'border-red-300' : 'border-gray-200'
                            }`}
                        placeholder="Enter complete address"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-1 bg-white/70 focus:ring-[#FF703C] ${errors.description ? 'border-red-300' : 'border-gray-200'
                            }`}
                        placeholder="Optional description about your PG"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-[#D3C3BC] text-gray-900 py-2 px-4 rounded-2xl hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[#FF703C] border-orange-300 border-1 text-white hover:bg-[#E03E00] hover:text-white py-2 px-4 rounded-2xl disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Updating...' : 'Update Community'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPgCommunityForm