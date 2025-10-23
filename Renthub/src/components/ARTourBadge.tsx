import { Cube } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface ARTourBadgeProps {
  available?: boolean
  className?: string
}

export function ARTourBadge({ available = true, className = '' }: ARTourBadgeProps) {
  if (!available) return null

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge 
        variant="secondary" 
        className={`gap-1.5 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40 transition-colors ${className}`}
      >
        <Cube className="w-3.5 h-3.5" weight="duotone" />
        <span>AR Tour</span>
      </Badge>
    </motion.div>
  )
}
