import { Globe } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/i18n/context'
import { LANGUAGES, Language } from '@/lib/i18n/types'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showLabel?: boolean
  align?: 'start' | 'center' | 'end'
}

export function LanguageSwitcher({ 
  variant = 'ghost', 
  size = 'icon',
  showLabel = false,
  align = 'end'
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useTranslation()

  const currentLanguage = LANGUAGES.find(lang => lang.code === language)

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2" aria-label="Change language" title="Change language">
          <Globe className="h-5 w-5" />
          {showLabel && (
            <span className="text-sm font-medium">
              {currentLanguage?.nativeName || 'English'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t.common.selectLanguage}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              'cursor-pointer gap-3',
              language === lang.code && 'bg-accent'
            )}
          >
            <span className="text-xl">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {language === lang.code && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
