'use client'
import { useEffect, useState } from 'react'

export type Role = 'founder' | 'reviewer'

const KEY = 'gtm-swarm.role'

export function useRole(): [Role, (r: Role) => void] {
  const [role, setRole] = useState<Role>(() => {
    if (typeof window === 'undefined') return 'founder'
    return (localStorage.getItem(KEY) as Role) || 'founder'
  })
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem(KEY, role)
  }, [role])
  return [role, setRole]
}
