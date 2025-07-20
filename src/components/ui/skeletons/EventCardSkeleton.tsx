import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import Card from '../Card';

const EventCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4 space-y-4">
      {/* Event status badge */}
      <div className="flex justify-between items-start">
        <SkeletonLoader width={60} height={20} variant="rectangular" />
        <SkeletonLoader width={80} height={16} variant="text" />
      </div>

      {/* Teams */}
      <div className="space-y-2">
        <SkeletonLoader height={20} variant="text" />
        <div className="flex items-center justify-center">
          <SkeletonLoader width={30} height={16} variant="text" />
        </div>
        <SkeletonLoader height={20} variant="text" />
      </div>

      {/* Date */}
      <SkeletonLoader width={120} height={14} variant="text" />

      {/* Odds buttons */}
      <div className="grid grid-cols-2 gap-2">
        <SkeletonLoader height={40} variant="rectangular" />
        <SkeletonLoader height={40} variant="rectangular" />
      </div>
      
      {/* Draw button (sometimes) */}
      <SkeletonLoader height={40} variant="rectangular" />
    </Card>
  );
};

export default EventCardSkeleton;