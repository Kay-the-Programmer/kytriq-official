import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

interface StatusPageProps {
    onNavigate?: (page: string, id: string) => void;
}

const StatusPage: React.FC<StatusPageProps> = ({ onNavigate }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('current');

    // Monitor component performance
    usePerformanceMonitor('StatusPage');

    // Memoized scroll progress update function
    const updateScrollProgress = useCallback(() => {
        const scrolled = window.scrollY;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        setScrollProgress(progress);
    }, []);

    // Optimized scroll handler with throttling and requestAnimationFrame
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [updateScrollProgress]);

    // Current system status data
    const systemComponents = [
        {
            id: 'api',
            name: 'API',
            status: 'operational',
            description: 'All API endpoints are functioning normally',
            lastUpdated: '2 minutes ago'
        },
        {
            id: 'dashboard',
            name: 'Dashboard',
            status: 'operational',
            description: 'Dashboard is accessible and responsive',
            lastUpdated: '5 minutes ago'
        },
        {
            id: 'website',
            name: 'Website',
            status: 'operational',
            description: 'Website is loading correctly with no issues',
            lastUpdated: '10 minutes ago'
        },
        {
            id: 'database',
            name: 'Database',
            status: 'operational',
            description: 'Database queries are executing with normal latency',
            lastUpdated: '15 minutes ago'
        },
        {
            id: 'auth',
            name: 'Authentication',
            status: 'operational',
            description: 'Login and authentication services are working properly',
            lastUpdated: '20 minutes ago'
        },
        {
            id: 'payments',
            name: 'Payment Processing',
            status: 'degraded',
            description: 'Some payment transactions may experience delays',
            lastUpdated: '25 minutes ago'
        },
        {
            id: 'storage',
            name: 'File Storage',
            status: 'operational',
            description: 'File uploads and downloads are functioning normally',
            lastUpdated: '30 minutes ago'
        },
        {
            id: 'notifications',
            name: 'Notifications',
            status: 'operational',
            description: 'Email and push notifications are being delivered on time',
            lastUpdated: '35 minutes ago'
        }
    ];

    // Incident history data
    const incidentHistory = [
        {
            id: 'incident-1',
            date: 'June 15, 2023',
            title: 'API Performance Degradation',
            status: 'resolved',
            duration: '45 minutes',
            components: ['API', 'Database'],
            description: 'Some API endpoints experienced increased latency due to database connection issues. The problem was identified and resolved by optimizing database queries and increasing connection pool size.',
            updates: [
                { time: '10:15 AM', message: 'Investigating reports of slow API responses.' },
                { time: '10:30 AM', message: 'Identified database connection bottleneck as the root cause.' },
                { time: '10:45 AM', message: 'Implementing fix by optimizing queries and increasing connection pool.' },
                { time: '11:00 AM', message: 'Issue resolved. Monitoring for any recurrence.' }
            ]
        },
        {
            id: 'incident-2',
            date: 'May 28, 2023',
            title: 'Payment Processing Outage',
            status: 'resolved',
            duration: '2 hours',
            components: ['Payment Processing'],
            description: 'Payment processing was unavailable due to an issue with our payment gateway provider. We worked with the provider to restore service and implemented additional redundancy measures.',
            updates: [
                { time: '3:20 PM', message: 'Investigating reports of failed payment transactions.' },
                { time: '3:35 PM', message: 'Confirmed outage with payment gateway provider.' },
                { time: '4:45 PM', message: 'Payment provider working on restoring service.' },
                { time: '5:20 PM', message: 'Service partially restored, monitoring transaction success rate.' },
                { time: '5:30 PM', message: 'Full service restored. Implementing additional redundancy measures.' }
            ]
        },
        {
            id: 'incident-3',
            date: 'April 12, 2023',
            title: 'Dashboard Accessibility Issues',
            status: 'resolved',
            duration: '30 minutes',
            components: ['Dashboard'],
            description: 'Some users were unable to access the dashboard due to a caching issue after a recent deployment. The issue was resolved by clearing the cache and rolling back the problematic changes.',
            updates: [
                { time: '9:05 AM', message: 'Investigating reports of dashboard access issues.' },
                { time: '9:15 AM', message: 'Identified caching issue related to recent deployment.' },
                { time: '9:25 AM', message: 'Clearing cache and rolling back changes.' },
                { time: '9:35 AM', message: 'Issue resolved. All users can now access the dashboard.' }
            ]
        }
    ];

    // Scheduled maintenance data
    const scheduledMaintenance = [
        {
            id: 'maintenance-1',
            date: 'June 25, 2023',
            timeRange: '2:00 AM - 4:00 AM UTC',
            title: 'Database Optimization',
            components: ['Database'],
            description: 'We will be performing database optimization to improve query performance. During this time, the system may experience brief periods of increased latency.',
            status: 'upcoming'
        },
        {
            id: 'maintenance-2',
            date: 'July 10, 2023',
            timeRange: '1:00 AM - 3:00 AM UTC',
            title: 'API Infrastructure Upgrade',
            components: ['API'],
            description: 'We will be upgrading our API infrastructure to improve scalability and reliability. The API may be intermittently unavailable during this period.',
            status: 'upcoming'
        },
        {
            id: 'maintenance-3',
            date: 'May 15, 2023',
            timeRange: '2:00 AM - 3:30 AM UTC',
            title: 'Security Patch Deployment',
            components: ['Authentication', 'Dashboard', 'API'],
            description: 'We deployed critical security patches to our authentication system and related components. The maintenance was completed successfully with no service disruption.',
            status: 'completed'
        }
    ];

    // Status indicator component
    const StatusIndicator = ({ status }: { status: string }) => {
        let color = '';
        let label = '';
        
        switch (status) {
            case 'operational':
                color = 'bg-green-500';
                label = 'Operational';
                break;
            case 'degraded':
                color = 'bg-yellow-500';
                label = 'Degraded';
                break;
            case 'partial_outage':
                color = 'bg-orange-500';
                label = 'Partial Outage';
                break;
            case 'major_outage':
                color = 'bg-red-500';
                label = 'Major Outage';
                break;
            case 'maintenance':
                color = 'bg-blue-500';
                label = 'Maintenance';
                break;
            case 'resolved':
                color = 'bg-green-500';
                label = 'Resolved';
                break;
            case 'upcoming':
                color = 'bg-blue-500';
                label = 'Upcoming';
                break;
            case 'completed':
                color = 'bg-green-500';
                label = 'Completed';
                break;
            default:
                color = 'bg-gray-500';
                label = 'Unknown';
        }
        
        return (
            <div className="flex items-center">
                <div className={`w-3 h-3 ${color} rounded-full mr-2`}></div>
                <span className="text-sm font-medium">{label}</span>
            </div>
        );
    };

    // Calculate overall system status
    const calculateOverallStatus = () => {
        if (systemComponents.some(component => component.status === 'major_outage')) {
            return 'major_outage';
        } else if (systemComponents.some(component => component.status === 'partial_outage')) {
            return 'partial_outage';
        } else if (systemComponents.some(component => component.status === 'degraded')) {
            return 'degraded';
        } else if (systemComponents.some(component => component.status === 'maintenance')) {
            return 'maintenance';
        } else {
            return 'operational';
        }
    };

    const overallStatus = calculateOverallStatus();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-brand-gray-50">
            {/* Progress bar */}
            <div 
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-techflex-blue to-techflex-orange z-50 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-gray-900 mb-6 tracking-tight">
                        System Status
                    </h1>
                    <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto mb-10">
                        Current status of Kytriq services and past incidents.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Overall Status Card */}
                <div className="bg-white rounded-xl shadow-sm border border-brand-gray-100 p-8 mb-12">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className={`w-4 h-4 rounded-full mr-3 ${
                                overallStatus === 'operational' ? 'bg-green-500' :
                                overallStatus === 'degraded' ? 'bg-yellow-500' :
                                overallStatus === 'partial_outage' ? 'bg-orange-500' :
                                overallStatus === 'major_outage' ? 'bg-red-500' :
                                overallStatus === 'maintenance' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}></div>
                            <h2 className="text-2xl font-bold text-brand-gray-900">
                                {overallStatus === 'operational' ? 'All Systems Operational' :
                                overallStatus === 'degraded' ? 'Some Systems Degraded' :
                                overallStatus === 'partial_outage' ? 'Partial System Outage' :
                                overallStatus === 'major_outage' ? 'Major System Outage' :
                                overallStatus === 'maintenance' ? 'Scheduled Maintenance' : 'System Status Unknown'}
                            </h2>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-brand-gray-100 rounded-lg px-4 py-2 text-sm text-brand-gray-600">
                                <span className="font-medium">Last updated:</span> {new Date().toLocaleString()}
                            </div>
                            <button 
                                className="ml-4 bg-white border border-brand-gray-200 rounded-lg p-2 hover:bg-brand-gray-50 transition-colors duration-300"
                                title="Refresh status"
                                onClick={() => {
                                    // In a real app, this would fetch the latest status
                                    alert('Status refreshed');
                                }}
                            >
                                <Icon name="refresh-cw" className="w-5 h-5 text-brand-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8 border-b border-brand-gray-200">
                    <div className="flex space-x-8">
                        <button
                            className={`pb-4 text-sm font-medium transition-colors duration-300 relative ${
                                activeTab === 'current' 
                                    ? 'text-techflex-blue border-b-2 border-techflex-blue -mb-px' 
                                    : 'text-brand-gray-600 hover:text-brand-gray-900'
                            }`}
                            onClick={() => setActiveTab('current')}
                        >
                            Current Status
                        </button>
                        <button
                            className={`pb-4 text-sm font-medium transition-colors duration-300 relative ${
                                activeTab === 'incidents' 
                                    ? 'text-techflex-blue border-b-2 border-techflex-blue -mb-px' 
                                    : 'text-brand-gray-600 hover:text-brand-gray-900'
                            }`}
                            onClick={() => setActiveTab('incidents')}
                        >
                            Incident History
                        </button>
                        <button
                            className={`pb-4 text-sm font-medium transition-colors duration-300 relative ${
                                activeTab === 'maintenance' 
                                    ? 'text-techflex-blue border-b-2 border-techflex-blue -mb-px' 
                                    : 'text-brand-gray-600 hover:text-brand-gray-900'
                            }`}
                            onClick={() => setActiveTab('maintenance')}
                        >
                            Scheduled Maintenance
                        </button>
                    </div>
                </div>

                {/* Current Status Tab */}
                {activeTab === 'current' && (
                    <div className="space-y-6">
                        {systemComponents.map((component) => (
                            <div 
                                key={component.id}
                                className="bg-white rounded-xl shadow-sm border border-brand-gray-100 p-6 transition-all duration-300 hover:shadow-md"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="text-lg font-medium text-brand-gray-900 mb-1">
                                            {component.name}
                                        </h3>
                                        <p className="text-sm text-brand-gray-600">
                                            {component.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <StatusIndicator status={component.status} />
                                        <span className="text-xs text-brand-gray-500 mt-1">
                                            Updated {component.lastUpdated}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Incident History Tab */}
                {activeTab === 'incidents' && (
                    <div className="space-y-8">
                        {incidentHistory.map((incident) => (
                            <div 
                                key={incident.id}
                                className="bg-white rounded-xl shadow-sm border border-brand-gray-100 p-6 transition-all duration-300 hover:shadow-md"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-lg font-medium text-brand-gray-900 mr-3">
                                                {incident.title}
                                            </h3>
                                            <StatusIndicator status={incident.status} />
                                        </div>
                                        <div className="flex items-center text-sm text-brand-gray-600 mb-2">
                                            <Icon name="calendar" className="w-4 h-4 mr-1 text-brand-gray-400" />
                                            <span>{incident.date}</span>
                                            <span className="mx-2">•</span>
                                            <Icon name="clock" className="w-4 h-4 mr-1 text-brand-gray-400" />
                                            <span>Duration: {incident.duration}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {incident.components.map((component, index) => (
                                                <span 
                                                    key={index}
                                                    className="bg-brand-gray-100 text-brand-gray-700 text-xs px-2 py-1 rounded-full"
                                                >
                                                    {component}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-brand-gray-600">
                                            {incident.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="mt-6 border-t border-brand-gray-100 pt-4">
                                    <h4 className="text-sm font-medium text-brand-gray-900 mb-4">Incident Timeline</h4>
                                    <div className="space-y-4">
                                        {incident.updates.map((update, index) => (
                                            <div key={index} className="flex">
                                                <div className="mr-4 relative">
                                                    <div className="w-3 h-3 bg-techflex-blue rounded-full"></div>
                                                    {index < incident.updates.length - 1 && (
                                                        <div className="absolute top-3 bottom-0 left-1.5 w-px bg-brand-gray-200 -ml-px"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-brand-gray-500 mb-1">
                                                        {update.time}
                                                    </div>
                                                    <div className="text-sm text-brand-gray-700">
                                                        {update.message}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Scheduled Maintenance Tab */}
                {activeTab === 'maintenance' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-brand-gray-900 mb-4">Upcoming Maintenance</h3>
                        <div className="space-y-6">
                            {scheduledMaintenance
                                .filter(maintenance => maintenance.status === 'upcoming')
                                .map((maintenance) => (
                                    <div 
                                        key={maintenance.id}
                                        className="bg-white rounded-xl shadow-sm border border-brand-gray-100 p-6 transition-all duration-300 hover:shadow-md"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <h3 className="text-lg font-medium text-brand-gray-900 mr-3">
                                                        {maintenance.title}
                                                    </h3>
                                                    <StatusIndicator status={maintenance.status} />
                                                </div>
                                                <div className="flex items-center text-sm text-brand-gray-600 mb-2">
                                                    <Icon name="calendar" className="w-4 h-4 mr-1 text-brand-gray-400" />
                                                    <span>{maintenance.date}</span>
                                                    <span className="mx-2">•</span>
                                                    <Icon name="clock" className="w-4 h-4 mr-1 text-brand-gray-400" />
                                                    <span>{maintenance.timeRange}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {maintenance.components.map((component, index) => (
                                                        <span 
                                                            key={index}
                                                            className="bg-brand-gray-100 text-brand-gray-700 text-xs px-2 py-1 rounded-full"
                                                        >
                                                            {component}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-brand-gray-600">
                                                    {maintenance.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <h3 className="text-lg font-medium text-brand-gray-900 mb-4 mt-12">Past Maintenance</h3>
                        <div className="space-y-6">
                            {scheduledMaintenance
                                .filter(maintenance => maintenance.status === 'completed')
                                .map((maintenance) => (
                                    <div 
                                        key={maintenance.id}
                                        className="bg-white rounded-xl shadow-sm border border-brand-gray-100 p-6 transition-all duration-300 hover:shadow-md"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <h3 className="text-lg font-medium text-brand-gray-900 mr-3">
                                                        {maintenance.title}
                                                    </h3>
                                                    <StatusIndicator status={maintenance.status} />
                                                </div>
                                                <div className="flex items-center text-sm text-brand-gray-600 mb-2">
                                                    <Icon name="calendar" className="w-4 h-4 mr-1 text-brand-gray-400" />
                                                    <span>{maintenance.date}</span>
                                                    <span className="mx-2">•</span>
                                                    <Icon name="clock" className="w-4 h-4 mr-1 text-brand-gray-400" />
                                                    <span>{maintenance.timeRange}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {maintenance.components.map((component, index) => (
                                                        <span 
                                                            key={index}
                                                            className="bg-brand-gray-100 text-brand-gray-700 text-xs px-2 py-1 rounded-full"
                                                        >
                                                            {component}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-brand-gray-600">
                                                    {maintenance.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Subscribe to updates */}
                <div className="mt-20 bg-gradient-to-r from-techflex-blue/10 to-techflex-orange/10 rounded-2xl p-8 border border-white">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-brand-gray-900 mb-2">
                            Subscribe to Status Updates
                        </h2>
                        <p className="text-brand-gray-600 max-w-2xl mx-auto">
                            Get notified about system incidents and maintenance. We'll send you an email when there's an update to our system status.
                        </p>
                    </div>
                    <div className="max-w-md mx-auto">
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-techflex-blue focus:ring-2 focus:ring-techflex-blue/20 outline-none transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-techflex-blue to-techflex-orange text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm flex items-center gap-2"
                            >
                                <Icon name="bell" className="w-4 h-4" />
                                Subscribe
                            </button>
                        </form>
                        <p className="text-xs text-brand-gray-500 mt-2 text-center">
                            We'll only send you emails related to system status. You can unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StatusPage;