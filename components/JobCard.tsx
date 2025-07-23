import React, { memo, useCallback } from 'react';
import Icon from './Icon';

interface JobCardProps {
    job: {
        id: string;
        title: string;
        department: string;
        location: string;
        description: string;
        requirements: string[];
        isRemote?: boolean;
    };
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
    onApply: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isExpanded, onToggleExpand, onApply }) => {
    // Memoized event handlers
    const handleToggleExpand = useCallback(() => {
        onToggleExpand(job.id);
    }, [job.id, onToggleExpand]);

    const handleApply = useCallback(() => {
        onApply(job.id);
    }, [job.id, onApply]);

    return (
        <div 
            className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
                isExpanded ? 'ring-2 ring-techflex-blue' : ''
            }`}
        >
            <div 
                className="p-6 cursor-pointer"
                onClick={handleToggleExpand}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center mb-2">
                            <span className="text-xs font-medium text-brand-gray-500 bg-brand-gray-100 px-2 py-0.5 rounded">
                                {job.department}
                            </span>
                            {job.isRemote && (
                                <span className="ml-2 text-xs font-medium text-techflex-blue bg-techflex-blue-50 px-2 py-0.5 rounded flex items-center">
                                    <Icon name="globe-alt" className="w-3 h-3 mr-1" />
                                    Remote
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-brand-gray-800 group-hover:text-techflex-blue transition-colors duration-300">
                            {job.title}
                        </h3>
                        <p className="text-sm text-brand-gray-600 mt-1">
                            <Icon name="map-pin" className="w-4 h-4 inline-block mr-1 text-brand-gray-400" />
                            {job.location}
                        </p>
                    </div>
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                        isExpanded 
                            ? 'bg-techflex-blue text-white rotate-180' 
                            : 'bg-brand-gray-100 text-brand-gray-500 group-hover:bg-techflex-blue/10 group-hover:text-techflex-blue'
                        } transition-all duration-300 transform`}>
                        <Icon name="chevron-down" className="h-5 w-5" />
                    </div>
                </div>
            </div>
            
            {isExpanded && (
                <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-brand-gray-100">
                        <p className="text-brand-gray-600 mb-4">
                            {job.description}
                        </p>
                        
                        <h4 className="font-semibold text-brand-gray-800 mb-2">Requirements:</h4>
                        <ul className="list-disc pl-5 mb-6 text-brand-gray-600 space-y-1">
                            {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                        
                        <button
                            onClick={handleApply}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-techflex-blue text-white font-medium hover:bg-techflex-blue-600 transition-colors duration-300"
                        >
                            Apply for this position
                            <Icon name="arrow-right" className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(JobCard);