import { motion } from 'framer-motion';

function ProgressBar({assignmentProgress}: {assignmentProgress: number}) {
    
  return (
    <div className='mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm'>
        <div className='flex justify-between items-center mb-2'>
            <span className='font-semibold text-gray-800'>Assignment Progress</span>
            <span className='font-bold text-indigo-600'>{Math.round(assignmentProgress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
            className="bg-gradient-to-r from-violet-500 to-indigo-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${assignmentProgress}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            />
        </div>
    </div>
  )
}

export default ProgressBar
