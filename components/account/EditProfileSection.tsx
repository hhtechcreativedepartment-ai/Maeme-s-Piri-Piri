'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { CheckCircle } from 'lucide-react';

interface ProfileData {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
}

export default function EditProfileSection() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('maemes_profile');
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    } else if (user) {
      // Initialize with user data from auth context
      setProfileData(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (profileData.dateOfBirth && !/^\d{2}\/\d{2}\/\d{4}$/.test(profileData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please use MM/DD/YYYY format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('maemes_profile', JSON.stringify(profileData));

      // Here you would also call an API to save to backend
      // await updateUserProfile(profileData);

      setIsEditing(false);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-[#E8E0D5]">
        <div>
          <h3 className="text-2xl font-black text-[#1A1A1A] mb-1">Edit profile</h3>
          <p className="text-sm text-[#999999]">Keep your personal details up to date.</p>
        </div>
        <div className="bg-[#FFF9E6] text-[#8B5A00] px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
          ✓ Phone verified
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-sm font-medium text-green-700">Profile updated successfully!</p>
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Full Name and Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Full name</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isEditing
                  ? 'border-[#D4B896] bg-white focus:border-[#99041e] focus:outline-none'
                  : 'border-[#E8E0D5] bg-[#FAF8F5]'
              } text-[#1A1A1A] text-sm ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Phone number</label>
            <input
              type="tel"
              value={profileData.phone}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] bg-[#FAF8F5] text-[#1A1A1A] text-sm cursor-not-allowed"
            />
            <p className="text-xs text-[#999999] mt-1">Verified and cannot be changed</p>
          </div>
        </div>

        {/* Email and Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isEditing
                  ? 'border-[#D4B896] bg-white focus:border-[#99041e] focus:outline-none'
                  : 'border-[#E8E0D5] bg-[#FAF8F5]'
              } text-[#1A1A1A] text-sm ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Date of birth</label>
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              value={profileData.dateOfBirth}
              onChange={e => handleInputChange('dateOfBirth', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isEditing
                  ? 'border-[#D4B896] bg-white focus:border-[#99041e] focus:outline-none'
                  : 'border-[#E8E0D5] bg-[#FAF8F5]'
              } text-[#1A1A1A] text-sm ${errors.dateOfBirth ? 'border-red-500' : ''}`}
            />
            {errors.dateOfBirth && <p className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-[#FFC107] text-[#1A1A1A] font-bold rounded-full hover:bg-[#FFB300] disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Update profile'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 border-2 border-[#D4B896] text-[#1A1A1A] font-bold rounded-full hover:bg-[#FAF8F5] transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-[#FFC107] text-[#1A1A1A] font-bold rounded-full hover:bg-[#FFB300] transition-colors"
            >
              Edit profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
