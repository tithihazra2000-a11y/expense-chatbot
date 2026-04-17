import { useState } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"

export interface UserProfile {
  name: string
  email: string
  currency: string
  monthlyBudget: number
  monthlyIncome: number
  avatar: string
}

const defaultProfile: UserProfile = {
  name: "User",
  email: "",
  currency: "INR",
  monthlyBudget: 10000,
  monthlyIncome: 50000,
  avatar: ""
}

export default function App() {
  const [user, setUser] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)

  return (
    <>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <Dashboard profile={profile} onProfileUpdate={setProfile} />
      )}
    </>
  )
}