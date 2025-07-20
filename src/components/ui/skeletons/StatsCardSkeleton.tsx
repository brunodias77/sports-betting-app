import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import Card from '../Card';

const StatsCardSkeleton: React.FC = () => {
  return (
    <Card className="p-6 space-y-4">
      {/* Title */}
      <SkeletonLoader width={150} height={20} variant="text" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <SkeletonLoader width={80} height={14} variant="text" />
          <SkeletonLoader width={60} height={24} variant="text" />
        </div>
        <div className="space-y-2">
          <SkeletonLoader width={90} height={14} variant="text" />
          <SkeletonLoader width={70} height={24} variant="text" />
        </div>
        <div className="space-y-2">
          <SkeletonLoader width={100} height={14} variant="text" />
          <SkeletonLoader width={80} height={24} variant="text" />
        </div>
        <div className="space-y-2">
          <SkeletonLoader width={85} height={14} variant="text" />
          <SkeletonLoader width={65} height={24} variant="text" />
        </div>
      </div>

      {/* Additional metric */}
      <div className="pt-4 border-t border-gray-100">
        <div className="space-y-2">
          <SkeletonLoader width={120} height={14} variant="text" />
          <SkeletonLoader width={90} height={20} variant="text" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCardSkeleton;