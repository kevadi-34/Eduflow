'use client'

import { useState } from 'react'
import { User, Lock, Bell, Shield, Save, Loader2, Check } from 'lucide-react'

interface Props {
  user: { name: string; email: string; role: string }
}

export default function SettingsClient({ user }: Props) {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    bio: '',
  })

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  })

  const [notifications, setNotifications] = useState({
    emailEnrollment: true,
    emailAchievements: true,
    emailSurveys: false,
    emailForum: false,
  })

  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')

    if (activeTab === 'password') {
      if (passwords.newPass !== passwords.confirm) {
        setError('New passwords do not match')
        setSaving(false)
        return
      }
      if (passwords.newPass.length < 6) {
        setError('Password must be at least 6 characters')
        setSaving(false)
        return
      }
    }

    // Simulate save
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: Shield },
  ]

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setError(''); setSaved(false) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-white text-lg">Profile Information</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/20 flex items-center justify-center text-2xl font-bold text-primary-400">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-slate-400 text-sm">{user.email}</p>
              <span className="badge badge-warning text-xs mt-1">{user.role}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
            <input
              className="input w-full"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email Address</label>
            <input
              className="input w-full"
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Bio</label>
            <textarea
              className="input w-full h-24 resize-none"
              placeholder="Tell us a little about yourself..."
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-white text-lg">Change Password</h2>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Current Password</label>
            <input
              className="input w-full"
              type="password"
              placeholder="Enter current password"
              value={passwords.current}
              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">New Password</label>
            <input
              className="input w-full"
              type="password"
              placeholder="Enter new password"
              value={passwords.newPass}
              onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Confirm New Password</label>
            <input
              className="input w-full"
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>

          <p className="text-xs text-slate-500">Password must be at least 6 characters long.</p>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-white text-lg">Notification Preferences</h2>

          {[
            { key: 'emailEnrollment', label: 'Course Enrollments', desc: 'Get notified when you enroll in a course' },
            { key: 'emailAchievements', label: 'Achievements', desc: 'Get notified when you earn an achievement' },
            { key: 'emailSurveys', label: 'New Surveys', desc: 'Get notified when a new survey is available' },
            { key: 'emailForum', label: 'Forum Replies', desc: 'Get notified when someone replies to your post' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-primary-500' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  notifications[item.key as keyof typeof notifications] ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="space-y-4">
          <div className="card space-y-4">
            <h2 className="font-semibold text-white text-lg">Account Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 mb-1">Account Type</p>
                <p className="text-white font-medium">{user.role}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 mb-1">Email</p>
                <p className="text-white font-medium truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="card border-red-900/30 space-y-3">
            <h2 className="font-semibold text-red-400 text-lg">Danger Zone</h2>
            <p className="text-slate-400 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800/50 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Save Button */}
      {activeTab !== 'account' && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      )}
    </div>
  )
}
