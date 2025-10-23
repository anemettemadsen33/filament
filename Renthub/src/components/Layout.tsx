import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, Property, Conversation } from '@/lib/types'
import { UserButton } from '@/components/UserButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { CurrencySelector } from '@/components/CurrencySelector'
import { AIChatButton } from '@/components/AIChatButton'
import { NotificationCenter } from '@/components/NotificationCenter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Buildings, Plus, Heart, House, Sparkle, SquaresFour, ChatCircle, MapTrifold, Users, MagicWand, UploadSimple, CaretDown, FunnelSimple } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'
import { useTranslation } from '@/lib/i18n/context'

interface LayoutProps {
  children: ReactNode
  currentUser: User | null
  favorites: string[]
  properties: Property[]
  conversations?: Conversation[]
  onSignIn: () => void
  onSignOut: () => void
  onOpenProfile: () => void
  onOpenDashboard: () => void
  onOpenAddProperty: () => void
  onOpenImportProperties?: () => void
  onOpenMessages?: () => void
  onPropertySelect?: (propertyId: string) => void
}

export function Layout({
  children,
  currentUser,
  favorites,
  properties,
  conversations = [],
  onSignIn,
  onSignOut,
  onOpenProfile,
  onOpenDashboard,
  onOpenAddProperty,
  onOpenImportProperties,
  onOpenMessages,
  onPropertySelect
}: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.15_255/0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.65_0.18_35/0.04),transparent_50%)] pointer-events-none" />
      
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm overflow-x-hidden">
        <div className="w-full max-w-[100vw] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between gap-2 min-h-[3.5rem] sm:min-h-[4rem] lg:min-h-[4.5rem] py-1.5 sm:py-2">
            <motion.div 
              className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                    <Buildings size={18} weight="bold" className="text-primary-foreground sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </div>
                </div>
                <div className="hidden sm:block min-w-0">
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">RentHub</h1>
                  <p className="text-[0.6rem] sm:text-[0.65rem] text-muted-foreground font-medium truncate">{t.hero.subtitle}</p>
                </div>
              </Link>
            </motion.div>
            
            <nav className="hidden lg:flex items-center gap-0.5 flex-shrink min-w-0 overflow-x-auto scrollbar-hide">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                asChild
                className="font-medium text-xs px-2 h-8 flex-shrink-0"
              >
                <Link to="/">
                  <House size={14} className="mr-1" />
                  <span className="whitespace-nowrap">{t.nav.home}</span>
                </Link>
              </Button>
              <Button
                variant={isActive('/explore') ? 'default' : 'ghost'}
                asChild
                className="font-medium text-xs px-2 h-8 flex-shrink-0"
              >
                <Link to="/explore">
                  <Sparkle size={14} className="mr-1" />
                  <span className="whitespace-nowrap">{t.nav.explore}</span>
                </Link>
              </Button>
              <Button
                variant={isActive('/map') ? 'default' : 'ghost'}
                asChild
                className="font-medium text-xs px-2 h-8 flex-shrink-0"
              >
                <Link to="/map">
                  <MapTrifold size={14} className="mr-1" />
                  <span className="whitespace-nowrap">{t.nav.map}</span>
                </Link>
              </Button>
              <Button
                variant={isActive('/roommates') ? 'default' : 'ghost'}
                asChild
                className="font-medium text-xs px-2 h-8 flex-shrink-0"
              >
                <Link to="/roommates">
                  <Users size={14} className="mr-1" />
                  <span className="whitespace-nowrap">{t.nav.roommates}</span>
                </Link>
              </Button>
              <Button
                variant={isActive('/photo-enhancement') ? 'default' : 'ghost'}
                asChild
                className="font-medium text-xs px-2 h-8 flex-shrink-0"
              >
                <Link to="/photo-enhancement">
                  <MagicWand size={14} weight="fill" className="mr-1" />
                  <span className="whitespace-nowrap">Photo AI</span>
                </Link>
              </Button>
              <Button
                variant={isActive('/filter-presets') ? 'default' : 'ghost'}
                asChild
                className="font-medium text-xs px-2 h-8 flex-shrink-0"
              >
                <Link to="/filter-presets">
                  <FunnelSimple size={14} weight="bold" className="mr-1" />
                  <span className="whitespace-nowrap">Presets</span>
                </Link>
              </Button>
              <Button
                variant={isActive('/favorites') ? 'default' : 'ghost'}
                asChild
                className="font-medium relative text-xs px-2 h-8 flex-shrink-0"
              >
                <Link to="/favorites">
                  <Heart size={14} className="mr-1" />
                  <span className="whitespace-nowrap">{t.nav.favorites}</span>
                  {favorites.length > 0 && (
                    <Badge className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[0.6rem]">
                      {favorites.length}
                    </Badge>
                  )}
                </Link>
              </Button>
              {currentUser && (
                <Button
                  variant={isActive('/dashboard') ? 'default' : 'ghost'}
                  asChild
                  className="font-medium text-xs px-2 h-8 flex-shrink-0"
                >
                  <Link to="/dashboard">
                    <SquaresFour size={14} className="mr-1" />
                    <span className="whitespace-nowrap">{t.nav.dashboard}</span>
                  </Link>
                </Button>
              )}
            </nav>

            <motion.div
              className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentUser && onOpenMessages && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="relative h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                >
                  <Link to="/messages" aria-label="Open messages" title="Open messages">
                    <ChatCircle size={16} weight="bold" className="sm:w-[18px] sm:h-[18px]" />
                    {totalUnread > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-0.5 -right-0.5 h-3.5 min-w-3.5 px-0.5 flex items-center justify-center text-[0.55rem] font-bold"
                      >
                        {totalUnread > 99 ? '99+' : totalUnread}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )}
              {currentUser && onPropertySelect && (
                <div className="hidden sm:block flex-shrink-0">
                  <NotificationCenter 
                    userId={currentUser.id}
                    onNotificationClick={(notification) => {
                      if (notification.propertyId) {
                        onPropertySelect(notification.propertyId)
                      }
                      if (notification.actionUrl) {
                        navigate(notification.actionUrl)
                      }
                    }}
                  />
                </div>
              )}
              <div className="hidden sm:block flex-shrink-0">
                <UserButton
                  isAuthenticated={!!currentUser}
                  user={currentUser ? { login: currentUser.login, avatarUrl: currentUser.avatarUrl, email: currentUser.email } : null}
                  onSignIn={onSignIn}
                  onSignOut={onSignOut}
                  onOpenProfile={onOpenProfile}
                  onOpenDashboard={onOpenDashboard}
                />
              </div>
              <div className="hidden md:block flex-shrink-0">
                <CurrencySelector />
              </div>
              <div className="flex-shrink-0">
                <LanguageSwitcher />
              </div>
              <div className="hidden lg:block flex-shrink-0">
                <ThemeToggle />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold will-change-transform hover:scale-105 transition-transform duration-300 h-8 sm:h-9 text-[0.7rem] sm:text-xs px-1.5 sm:px-2.5 shrink-0"
                  >
                    <Plus size={14} weight="bold" className="sm:mr-1.5 sm:w-[16px] sm:h-[16px]" />
                    <span className="hidden sm:inline whitespace-nowrap">List</span>
                    <CaretDown size={12} weight="bold" className="ml-0.5 sm:ml-1 sm:w-[14px] sm:h-[14px]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 sm:w-52">
                  <DropdownMenuItem onClick={onOpenAddProperty} className="cursor-pointer py-2">
                    <Plus size={14} weight="bold" className="mr-2 text-primary sm:w-4 sm:h-4" />
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">Add Single Property</span>
                      <span className="text-[0.6rem] text-muted-foreground">Create one listing</span>
                    </div>
                  </DropdownMenuItem>
                  {onOpenImportProperties && (
                    <DropdownMenuItem onClick={onOpenImportProperties} className="cursor-pointer py-2">
                      <UploadSimple size={14} weight="bold" className="mr-2 text-accent sm:w-4 sm:h-4" />
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">Import Properties</span>
                        <span className="text-[0.6rem] text-muted-foreground">Upload CSV/Excel</span>
                      </div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="relative">
        {children}
      </main>

      <footer className="relative border-t border-border/50 bg-background/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Buildings size={20} weight="bold" className="text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">RentHub</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Find your perfect rental space with ease. Browse thousands of properties across multiple locations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:opacity-70 transition-opacity">Home</Link></li>
                <li><Link to="/explore" className="text-muted-foreground hover:opacity-70 transition-opacity">Explore</Link></li>
                <li><Link to="/map" className="text-muted-foreground hover:opacity-70 transition-opacity">Map View</Link></li>
                <li><Link to="/favorites" className="text-muted-foreground hover:opacity-70 transition-opacity">Favorites</Link></li>
                {currentUser && <li><Link to="/dashboard" className="text-muted-foreground hover:opacity-70 transition-opacity">Dashboard</Link></li>}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Property Types</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/explore?type=apartment" className="text-muted-foreground hover:opacity-70 transition-opacity">Apartments</Link></li>
                <li><Link to="/explore?type=house" className="text-muted-foreground hover:opacity-70 transition-opacity">Houses</Link></li>
                <li><Link to="/explore?type=studio" className="text-muted-foreground hover:opacity-70 transition-opacity">Studios</Link></li>
                <li><Link to="/explore?type=condo" className="text-muted-foreground hover:opacity-70 transition-opacity">Condos</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/how-it-works" className="text-muted-foreground hover:opacity-70 transition-opacity">How it Works</Link></li>
                <li><Link to="/safety-tips" className="text-muted-foreground hover:opacity-70 transition-opacity">Safety Tips</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:opacity-70 transition-opacity">FAQ</Link></li>
                <li><Link to="/support" className="text-muted-foreground hover:opacity-70 transition-opacity">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} RentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AIChatButton properties={properties} onPropertySelect={onPropertySelect} />

      <Toaster />
    </div>
  )
}
