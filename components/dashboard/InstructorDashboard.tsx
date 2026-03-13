'use client'

import Link from 'next/link'
import { BookOpen, ClipboardList, BarChart3, Users, ArrowRight, GraduationCap } from 'lucide-react'

interface Props {
  user: { name: string; email: string; role: string }
}

export default function InstructorDashboard({ user }: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const quickLinks = [
    { href: '/dashboard/instructor/courses', label: 'My Courses', desc: 'Manage your course units and lessons', icon: GraduationCap, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { href: '/dashboard/instructor/assignments', label: 'Assignments', desc: 'Create and grade assignments', icon: ClipboardList, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { href: '/dashboard/instructor/exams', label: 'Exams', desc: 'Create timed exams for students', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { href: '/dashboard/forum', label: 'Forum', desc: 'Interact with your students', icon: Users, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  ]

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">
          {greeting}, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">Welcome to your Instructor Portal.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href} className="card-hover group flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors">{item.label}</h3>
              <p className="text-slate-400 text-sm mt-0.5">{item.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all mt-1" />
          </Link>
        ))}
      </div>

      <div className="card border-primary-500/20">
        <h2 className="font-semibold text-white mb-2">Getting Started</h2>
        <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
          <li>Go to <Link href="/dashboard/instructor/courses" className="text-primary-400 hover:underline">My Courses</Link> to see courses assigned to you</li>
          <li>Add units and lessons to your courses</li>
          <li>Create <Link href="/dashboard/instructor/assignments" className="text-primary-400 hover:underline">Assignments</Link> with deadlines for students</li>
          <li>Create <Link href="/dashboard/instructor/exams" className="text-primary-400 hover:underline">Timed Exams</Link> and publish them</li>
        </ol>
      </div>
    </div>
  )
}

