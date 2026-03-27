import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-700/50 rounded-md ${className}`}
        ></div>
      ))}
    </>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-800 bg-gray-900/40 rounded-xl p-4 w-full h-full flex flex-col gap-3">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" count={3} />
      <div className="mt-auto">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
      </div>
    </div>
  );
};
