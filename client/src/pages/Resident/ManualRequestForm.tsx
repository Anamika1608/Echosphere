import React, { useState, useRef, useEffect } from 'react';
import { serverUrl } from '@/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ManualRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    requestType: 'issue' | 'service';
    issue_description: string;
    issue_location: string;
    issue_type: string;
    service_details: string;
}

const ManualRequestForm: React.FC<ManualRequestFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        requestType: 'issue',
        issue_description: '',
        issue_location: '',
        issue_type: '',
        service_details: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const formRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close form
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.requestType === 'issue') {
            if (!formData.issue_description.trim()) {
                newErrors.issue_description = 'Issue description is required';
            } else if (formData.issue_description.trim().length < 10) {
                newErrors.issue_description = 'Issue description must be at least 10 characters long';
            }

            if (!formData.issue_location.trim()) {
                newErrors.issue_location = 'Location is required';
            } else if (formData.issue_location.trim().length < 2) {
                newErrors.issue_location = 'Location must be at least 2 characters long';
            }
        } else {
            if (!formData.service_details.trim()) {
                newErrors.service_details = 'Service description is required';
            } else if (formData.service_details.trim().length < 10) {
                newErrors.service_details = 'Service description must be at least 10 characters long';
            }

            if (!formData.issue_location.trim()) {
                newErrors.issue_location = 'Location is required';
            } else if (formData.issue_location.trim().length < 2) {
                newErrors.issue_location = 'Location must be at least 2 characters long';
            }
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
            setErrors({});

            let apiData;
            if (formData.requestType === 'issue') {
                apiData = {
                    issue_description: formData.issue_description.trim(),
                    issue_location: formData.issue_location.trim(),
                    issue_type: 'Issue Report',
                };
            } else {
                apiData = {
                    issue_description: formData.service_details.trim(),
                    issue_location: formData.issue_location.trim(),
                    issue_type: 'Service Request',
                    service_details: formData.service_details.trim(),
                };
            }

            const response = await axios.post(`${serverUrl}/voice-chat/createNewServiceRequest`, apiData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (data) {
                toast.success(
                    `${data.type === 'issue' ? 'Issue' : 'Service request'} submitted successfully!`
                );
              

            } else {
                if (data.requiresMoreInfo) {
                    setErrors({ submit: data.message || 'Please provide more detailed information' });
                } else {
                    throw new Error(data.message || 'Failed to submit request');
                }
            }
        } catch (err: any) {
            let errorMessage = 'Failed to submit request. Please try again.';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
             onClose();
        }
    };

    const isFormValid = () => {
        if (formData.requestType === 'issue') {
            return formData.issue_description.trim().length >= 10 && formData.issue_location.trim().length >= 2;
        } else {
            return formData.service_details.trim().length >= 10 && formData.issue_location.trim().length >= 2;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="rounded-2xl shadow-2xl backdrop-blur-2xl">
            <div
                ref={formRef}
                className="pt-10 px-6 pb-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
                style={{
                    backgroundImage:
                        'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFFAF3 67.31%,#FFFAF3 100%)',
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Submit Request</h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-700 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Request Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Request Type *</label>
                        <div className="flex gap-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="requestType"
                                    value="issue"
                                    checked={formData.requestType === 'issue'}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="mr-3 text-[#FF703C] focus:ring-[#FF703C] w-4 h-4"
                                />
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">🔧</span>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Report an Issue</div>
                                        <div className="text-xs text-gray-600">Something is broken or not working</div>
                                    </div>
                                </div>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="requestType"
                                    value="service"
                                    checked={formData.requestType === 'service'}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="mr-3 text-[#FF703C] focus:ring-[#FF703C] w-4 h-4"
                                />
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">🛎️</span>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Request Service</div>
                                        <div className="text-xs text-gray-600">Need a new service or maintenance</div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Conditional Fields */}
                    {formData.requestType === 'issue' ? (
                        <div>
                            <label htmlFor="issue_description" className="block text-sm font-medium text-gray-700 mb-1">
                                Issue Description *
                            </label>
                            <textarea
                                id="issue_description"
                                name="issue_description"
                                value={formData.issue_description}
                                onChange={handleChange}
                                rows={4}
                                disabled={loading}
                                className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-1 bg-white/70 focus:ring-[#FF703C] disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.issue_description ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                placeholder="Describe the issue in detail... (e.g., The bathroom tap is leaking and won't turn off completely)"
                            />
                            {errors.issue_description && <p className="mt-1 text-sm text-red-600">{errors.issue_description}</p>}
                            <div className="text-xs text-gray-500 mt-1">{formData.issue_description.length} characters (minimum 10)</div>
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="service_details" className="block text-sm font-medium text-gray-700 mb-1">
                                Service Description *
                            </label>
                            <textarea
                                id="service_details"
                                name="service_details"
                                value={formData.service_details}
                                onChange={handleChange}
                                rows={4}
                                disabled={loading}
                                className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-1 bg-white/70 focus:ring-[#FF703C] disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.service_details ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                placeholder="Describe the service you need... (e.g., Need deep cleaning of common areas and my room)"
                            />
                            {errors.service_details && <p className="mt-1 text-sm text-red-600">{errors.service_details}</p>}
                            <div className="text-xs text-gray-500 mt-1">{formData.service_details.length} characters (minimum 10)</div>
                        </div>
                    )}

                    {/* Location */}
                    <div>
                        <label htmlFor="issue_location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location *
                        </label>
                        <input
                            type="text"
                            id="issue_location"
                            name="issue_location"
                            value={formData.issue_location}
                            onChange={handleChange}
                            disabled={loading}
                            className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-1 bg-white/70 focus:ring-[#FF703C] disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.issue_location ? 'border-red-300' : 'border-gray-200'
                                }`}
                            placeholder="e.g., Room 101, Common bathroom, Kitchen area"
                        />
                        {errors.issue_location && <p className="mt-1 text-sm text-red-600">{errors.issue_location}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-[#D3C3BC] text-gray-900 py-2 px-4 rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || !isFormValid()}
                            className="flex-1 bg-[#FF703C] border-orange-300 border-1 text-white hover:bg-[#E03E00] hover:text-white py-2 px-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                `Submit ${formData.requestType === 'issue' ? 'Issue' : 'Service Request'}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualRequestForm;
