import { useState } from 'react'
  import Swal from 'sweetalert2'
  import FacultyLoading from './faculty/FacultyLoading'

import { allFaculty, allSubjects } from './mock/dummyData'
import type { FacultyType, Subject } from './mock/types'


  function MainFacultyLoading() {
    // Initialize state with dummy data
    const [faculty] = useState<FacultyType[]>(allFaculty)
    const [subjects, setSubjects] = useState<Subject[]>(allSubjects)

    const splitAssigned = (assignedTime: string) =>
      assignedTime
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)

    const hasConflict = (facultyName: string, day: string, start: string, end: string) => {
      const facultySubjects = subjects.filter((s) => s.assigned?.faculty === facultyName)
      for (const sub of facultySubjects) {
        const assigned = sub.assigned?.time || ''
        const parts = splitAssigned(assigned)
        for (const part of parts) {
          // part: "Day HH:MM-HH:MM"
          const [pDay, range] = part.split(' ')
          if (pDay !== day) continue
          const [assignedStartTime, assignedEndTime] = (range || '').split('-')
          if (!assignedStartTime || !assignedEndTime) continue
          // Overlap: start < aEnd && aStart < end
          if (start < assignedEndTime && assignedStartTime < end) {
            return {
              code: sub.code,
              name: sub.name,
              day: pDay,
              start: assignedStartTime,
              end: assignedEndTime,
            }
          }
        }
      }
      return null
    }

    const onAssign = (payload: { subjectId: number; facultyName: string; day: string; startTime: string; endTime: string }) => {
      const { subjectId, facultyName, day, startTime, endTime } = payload
      const fac = faculty.find((f) => f.name === facultyName)
      if (!fac) return

      const assignedCount = subjects.filter((s) => s.assigned?.faculty === fac.name).length
      if (assignedCount >= fac.maxSubjects) {
        Swal.fire({
          icon: 'warning',
          title: 'Maximum Load Reached',
          text: `${fac.name} has already been assigned the maximum number of subjects (${fac.maxSubjects}).`,
          confirmButtonColor: '#4f46e5',
        })
        return
      }

      const conflict = hasConflict(fac.name, day, startTime, endTime)
      if (conflict) {
        Swal.fire({
          icon: 'error',
          title: 'Schedule Conflict Detected',
          html:
            `The selected time slot conflicts with an existing class:<br/><br/>` +
            `<b>${conflict.code} - ${conflict.name}</b><br/>` +
            `Scheduled on ${conflict.day} from ${conflict.start} to ${conflict.end}.`,
          confirmButtonColor: '#4f46e5',
          confirmButtonText: 'Okay',
        })
        return
      }

      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id !== subjectId) return s
          // Append this new (day, time) into semicolon-separated list.
          const newEntry = `${day} ${startTime}-${endTime}`
          if (!s.assigned) {
            return { ...s, assigned: { faculty: fac.name, time: newEntry } }
          }
          // If assigning to a different faculty, replace faculty and time with this new entry.
          if (s.assigned.faculty !== fac.name) {
            return { ...s, assigned: { faculty: fac.name, time: newEntry } }
          }
          // Same faculty: append if not already present for this day/time
          const parts = splitAssigned(s.assigned.time)
          const hasSame = parts.some(p => p === newEntry)
          const updated = hasSame ? parts : [...parts, newEntry]
          return { ...s, assigned: { faculty: fac.name, time: updated.join('; ') } }
        })
      )

      Swal.fire({
        icon: 'success',
        title: 'Assigned',
        text: `Assigned to ${fac.name} on ${day} ${startTime}-${endTime}.`,
        timer: 900,
        showConfirmButton: false,
      })
    }

    const onUnassign = (subjectId: number) => {
      setSubjects((prev) => prev.map((s) => (s.id === subjectId ? { ...s, assigned: null } : s)))
    }

    return (
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Faculty Loading</h1>
          <p className="text-gray-500 mt-1">Assign subjects to faculty based on expertise and availability.</p>
        </header>

        <FacultyLoading
          faculty={faculty}
          subjects={subjects}
          onAssign={onAssign}
          onUnassign={onUnassign}
        />
      </div>
    )
  }

  export default MainFacultyLoading