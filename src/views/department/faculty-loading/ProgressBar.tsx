import { motion } from 'framer-motion'

function ProgressBar({ assignmentProgress }: { assignmentProgress: number }) {
  const pct = Math.round(assignmentProgress)

  return (
    <div className="p-4 rounded-xl border border-white/20 bg-white/10 text-white shadow-inner">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Assignment Progress</span>
        <span className="font-bold">{pct}% Complete</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden">
        <motion.div
          className="h-2.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-white"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          role="progressbar"
        />
      </div>
    </div>
  )
}

export default ProgressBar