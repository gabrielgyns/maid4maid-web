// import React, { useState } from 'react';
// import { PlusCircle } from 'lucide-react';

// import { JobForm } from '@/pages/schedule/job-form';
// import { CreateJobInput } from '@/schemas/job.types';

// import { Button } from '../ui/button';
// import { Job, Team, ViewType } from './types/calendar.types';

// export interface CalendarViewProps {
//   jobs: Job[];
//   teams: Team[];
//   defaultView?: ViewType;
//   onCreateJob?: () => void;
//   onEditJob?: (jobId: string) => void;
//   onViewJob?: (jobId: string) => void;
//   loading?: boolean;
//   error?: string;
//   jobFormOpen?: boolean;
//   onJobFormClose?: () => void;
//   onJobFormSubmit?: (data: CreateJobInput) => void;
// }

// export const CalendarView: React.FC<CalendarViewProps> = ({
//   jobs,
//   teams,
//   defaultView = 'week',
//   onCreateJob,
//   onEditJob,
//   onViewJob,
//   loading = false,
//   error,
//   jobFormOpen = false,
//   onJobFormClose = () => {},
//   onJobFormSubmit = () => {},
// }) => {
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

//   const handleJobClick = (jobId: string) => {
//     setSelectedJobId(jobId);
//     if (onViewJob) {
//       onViewJob(jobId);
//     }
//   };

//   const handleDateSelect = (date: Date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <div className="flex h-full flex-col">
//       {/* Calendar toolbar with actions */}
//       <div className="mb-4 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Schedule</h1>

//         <div className="flex items-center gap-2">
//           {onCreateJob && (
//             <Button onClick={onCreateJob}>
//               <PlusCircle className="mr-2 h-4 w-4" />
//               New Job
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Error message if any */}
//       {error && (
//         <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Loading state */}
//       {loading ? (
//         <div className="flex flex-1 items-center justify-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
//         </div>
//       ) : (
//         <div className="flex-1">
//           <Calendar
//             jobs={jobs}
//             teams={teams}
//             onEventClick={handleJobClick}
//             selectedEventId={selectedJobId}
//             isLoading={loading}
//             error={error}
//             defaultView={defaultView}
//             onDateSelect={handleDateSelect}
//           />
//         </div>
//       )}

//       {/* Job Form Modal */}
//       {jobFormOpen && (
//         <JobForm
//           open={jobFormOpen}
//           onClose={onJobFormClose}
//           onSubmit={onJobFormSubmit}
//           teams={teams}
//           initialDate={selectedDate}
//         />
//       )}
//     </div>
//   );
// };

// export default CalendarView;
