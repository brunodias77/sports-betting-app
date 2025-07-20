import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import Card from '../Card';

const BetCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4 space-y-3">
      {/* Header with status badge */}
      <div className="flex justify-between items-start">
        <SkeletonLoader width={100} height={18} variant="text" />
        <SkeletonLoader width={60} height={20} variant="rectangular" />
      </div>

      {/* Event info */}
      <div className="space-y-2">
        <SkeletonLoader height={16} variant="text" />
        <SkeletonLoader width={120} height={14} variant="text" />
      </div>

      {/* Bet details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <SkeletonLoader width={80} height={14} variant="text" />
          <SkeletonLoader width={60} height={16} variant="text" />
        </div>
        <div className="space-y-1">
          <SkeletonLoader width={70} height={14} variant="text" />
          <SkeletonLoader width={80} height={16} variant="text" />
        </div>
      </div>

      {/* Amount and potential win */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <SkeletonLoader width={100} height={16} variant="text" />
        <SkeletonLoader width={80} height={18} variant="text" />
      </div>
    </Card>
  );
};

export default BetCardSkeleton;