import React, { memo, useCallback } from 'react';

interface DepartmentFilterProps {
    departments: string[];
    activeDepartment: string;
    onDepartmentChange: (department: string) => void;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({ 
    departments, 
    activeDepartment, 
    onDepartmentChange 
}) => {
    // Memoized handler for department change
    const handleDepartmentChange = useCallback((department: string) => {
        onDepartmentChange(department);
    }, [onDepartmentChange]);

    return (
        <div className="mb-8" role="group" aria-label="Department filters">
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex flex-wrap gap-3 justify-center">
                    {departments.map(department => {
                        const isActive = activeDepartment === department;
                        return (
                            <button
                                key={department}
                                onClick={() => handleDepartmentChange(department)}
                                className={`
                                    relative px-5 py-2.5 rounded-xl font-medium text-sm 
                                    transition-all duration-300 ease-in-out
                                    ${isActive 
                                        ? 'bg-techflex-blue text-white shadow-md' 
                                        : 'bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200'
                                    }
                                `}
                                aria-pressed={isActive}
                            >
                                {department === 'All' && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                                        <span className={`absolute inline-flex h-full w-full rounded-full ${isActive ? 'bg-white' : 'bg-techflex-blue'} opacity-50 animate-ping`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isActive ? 'bg-white' : 'bg-techflex-blue'}`}></span>
                                    </span>
                                )}
                                {department}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(DepartmentFilter);