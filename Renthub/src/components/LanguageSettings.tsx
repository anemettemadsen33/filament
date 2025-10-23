import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTranslation } from '@/lib/i18n/context'
import { LANGUAGES, Language } from '@/lib/i18n/types'
import { cn } from '@/lib/utils'

export function LanguageSettings() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t.preferences.language}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select your preferred language for the application
        </p>
      </div>

      <RadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <Card
              key={lang.code}
              className={cn(
                'relative cursor-pointer transition-all hover:border-primary/50',
                language === lang.code && 'border-primary bg-primary/5'
              )}
              onClick={() => setLanguage(lang.code)}
            >
              <Label
                htmlFor={`lang-${lang.code}`}
                className="flex items-center gap-3 p-4 cursor-pointer"
              >
                <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{lang.name}</div>
                </div>
                {language === lang.code && (
                  <span className="text-primary text-sm font-medium">✓</span>
                )}
              </Label>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
