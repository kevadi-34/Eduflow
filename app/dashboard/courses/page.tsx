import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Clock, CheckCircle, ArrowRight, GraduationCap } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: { select: { id: true } } },
          },
          _count: { select: { enrollments: true } },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  })

  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (e) => {
      const lessonIds = e.course.modules.flatMap((m) => m.lessons.map((l) => l.id))
      const completed = await prisma.progress.count({
        where: { userId: session.user.id, lessonId: { in: lessonIds }, completed: true },
      })
      return {
        ...e,
        totalLessons: lessonIds.length,
        completedLessons: completed,
        progress: lessonIds.length > 0 ? Math.round((completed / lessonIds.length) * 100) : 0,
      }
    })
  )

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">My Courses</h1>
          <p className="text-slate-400 mt-1">Track your enrolled courses and progress</p>
        </div>
        <Link href="/courses" className="btn-primary flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Browse More
        </Link>
      </div>

      {enrollmentsWithProgress.length === 0 ? (
        <div className="card text-center py-20">
          <GraduationCap className="w-14 h-14 text-slate-600 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-lg mb-2">No courses yet</h2>
          <p className="text-slate-400 text-sm mb-6">You haven't enrolled in any courses. Start learning today!</p>
          <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollmentsWithProgress.map((e) => (
            <Link
              key={e.id}
              href={`/courses/${e.courseId}`}
              className="card-hover group flex flex-col"
            >
              {/* Thumbnail */}
              <div className="h-32 bg-gradient-to-br from-primary-900/60 to-accent-900/40 rounded-xl mb-4 flex items-center justify-center border border-slate-700/30 relative">
                <BookOpen className="w-9 h-9 text-primary-400/60" />
                {e.progress === 100 && (
                  <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {e.course.category}
                </span>
                <span className={`badge text-xs ${
                  e.progress === 100 ? 'badge-success' :
                  e.progress > 0 ? 'badge-warning' : 'badge-primary'
                }`}>
                  {e.progress === 100 ? 'Completed' : e.progress > 0 ? 'In Progress' : 'Not Started'}
                </span>
              </div>

              <h3 className="font-display font-semibold text-white group-hover:text-primary-300 transition-colors mb-3 leading-snug flex-1">
                {e.course.title}
              </h3>

              {/* Progress Bar */}
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>{e.completedLessons} / {e.totalLessons} lessons</span>
                  <span>{e.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${e.progress}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(e.course.duration)}
                </span>
                <span className="ml-auto flex items-center gap-1 text-primary-400 group-hover:gap-2 transition-all">
                  {e.progress === 100 ? 'Review' : e.progress > 0 ? 'Continue' : 'Start'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
