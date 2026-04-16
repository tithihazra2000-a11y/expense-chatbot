import { useState, useEffect } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import Onboarding from "./components/Onboarding"
 
export interface UserProfile {
  name: string
  email: string
  currency: string
  monthlyIncome: number
  avatar: string
}
 
export default function App() {
  const [user, setUser] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [onboarded, setOnboarded] = useState(false)
 
  useEffect(() => {
    const saved = localStorage.getItem("ss_profile")
    const ob = localStorage.getItem("ss_onboarded")
    if (saved) setProfile(JSON.parse(saved))
    if (ob) setOnboarded(true)
  }, [])
 
  const handleLogin = (email: string) => {
    setUser(email)
  }
 
  const handleOnboardingComplete = (p: UserProfile) => {
    setProfile(p)
    localStorage.setItem("ss_profile", JSON.stringify(p))
    localStorage.setItem("ss_onboarded", "true")
    setOnboarded(true)
  }
 
  const handleProfileUpdate = (p: UserProfile) => {
    setProfile(p)
    localStorage.setItem("ss_profile", JSON.stringify(p))
  }
 
  if (!user) return <Login onLogin={handleLogin} />
  if (!onboarded) return <Onboarding email={user} onComplete={handleOnboardingComplete} />
  return <Dashboard profile={profile!} onProfileUpdate={handleProfileUpdate} />
}