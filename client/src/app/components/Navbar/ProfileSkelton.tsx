import React from 'react';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 animate-pulse">
      {/* Profile picture skeleton */}
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      
      {/* Name skeleton */}
      <div className="hidden md:block">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;