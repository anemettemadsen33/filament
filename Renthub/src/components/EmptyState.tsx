import { House, MagnifyingGlass } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export function EmptyState() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
        <motion.div 
          className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-border/50"
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <House size={48} weight="duotone" className="text-primary" />
          <motion.div
            className="absolute top-2 right-2"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <MagnifyingGlass size={24} weight="bold" className="text-accent" />
          </motion.div>
        </motion.div>
      </div>
      
      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
        No properties found
      </h3>
      <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
        Try adjusting your search criteria or clearing filters to discover more amazing properties.
      </p>
    </motion.div>
  )
}
