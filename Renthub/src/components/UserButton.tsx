import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, SignIn, SignOut, UserCircle, Gear, SquaresFour } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface UserButtonProps {
  isAuthenticated: boolean
  user: { login: string; avatarUrl: string; email: string } | null
  onSignIn: () => void
  onSignOut: () => void
  onOpenProfile: () => void
  onOpenDashboard: () => void
}

export function UserButton({ isAuthenticated, user, onSignIn, onSignOut, onOpenProfile, onOpenDashboard }: UserButtonProps) {
  if (!isAuthenticated || !user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={onSignIn}
          variant="outline"
          className="h-11 px-4 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
        >
          <SignIn size={20} weight="bold" className="mr-2" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      </motion.div>
    )
  }

  const initials = user.login.slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-11 w-11 rounded-full border-2 border-border/30 hover:border-primary/50 transition-all duration-300 p-0"
          aria-label="User menu"
          title="User menu"
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={user.avatarUrl} alt={user.login} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-card/95 backdrop-blur-xl border-border/50" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={user.avatarUrl} alt={user.login} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold text-foreground">{user.login}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenDashboard} className="cursor-pointer py-3">
          <SquaresFour size={18} weight="bold" className="mr-3 text-primary" />
          <span className="font-medium">My Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenProfile} className="cursor-pointer py-3">
          <Gear size={18} weight="bold" className="mr-3 text-accent" />
          <span className="font-medium">Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer py-3 text-destructive focus:text-destructive">
          <SignOut size={18} weight="bold" className="mr-3" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
