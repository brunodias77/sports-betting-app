import React from 'react';
import Card from '../ui/Card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  variant = 'default',
  isLoading = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'danger':
        return 'text-red-600 border-red-200 bg-red-50';
      case 'warning':
        return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      default:
        return 'text-gray-900 border-gray-200 bg-white';
    }
  };

  const getValueClasses = () => {
    switch (variant) {
      case 'success':
        return 'text-green-700';
      case 'danger':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      default:
        return 'text-gray-900';
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${getVariantClasses()} transition-colors duration-200`}>
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${getValueClasses()}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;