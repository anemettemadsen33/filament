import { motion } from 'framer-motion'
import { Globe, CheckCircle, Translate } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LanguageSettings } from '@/components/LanguageSettings'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslation } from '@/lib/i18n/context'
import { LANGUAGES } from '@/lib/i18n/types'

export function LanguagePage() {
  const { t, language } = useTranslation()
  const currentLang = LANGUAGES.find(l => l.code === language)

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Globe className="w-8 h-8 text-primary" weight="duotone" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Multi-Language Support
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience RentHub in your preferred language. We support 8 languages with full translation coverage.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="gap-2">
              <span className="text-xl">{currentLang?.flag}</span>
              <span>Currently using: {currentLang?.nativeName}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  8 Languages
                </CardTitle>
                <CardDescription>
                  Comprehensive language support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {LANGUAGES.map((lang) => (
                    <div key={lang.code} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.nativeName}</span>
                      {lang.code === language && (
                        <CheckCircle className="w-4 h-4 text-primary ml-auto" weight="fill" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Translate className="w-5 h-5 text-primary" />
                  Real-time Translation
                </CardTitle>
                <CardDescription>
                  Instant language switching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All interface elements update instantly when you change the language. No page refresh required.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Features translated:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Navigation menus</li>
                    <li>✓ Property listings</li>
                    <li>✓ Search & filters</li>
                    <li>✓ Booking process</li>
                    <li>✓ Messages & chat</li>
                    <li>✓ Dashboard & analytics</li>
                    <li>✓ Forms & buttons</li>
                    <li>✓ Error messages</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Switcher</CardTitle>
                <CardDescription>
                  Change language from anywhere
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The language switcher is always available in the header for quick access.
                </p>
                <div className="flex justify-center py-4">
                  <LanguageSwitcher variant="outline" size="default" showLabel />
                </div>
                <p className="text-sm text-muted-foreground">
                  Your language preference is automatically saved and will be remembered for future visits.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Language Preferences</CardTitle>
              <CardDescription>
                Choose your preferred language for the entire application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSettings />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Translation Examples</CardTitle>
              <CardDescription>
                See how the current language affects different parts of the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">Navigation</h4>
                  <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                    <div><span className="font-medium">Home:</span> {t.nav.home}</div>
                    <div><span className="font-medium">Explore:</span> {t.nav.explore}</div>
                    <div><span className="font-medium">Favorites:</span> {t.nav.favorites}</div>
                    <div><span className="font-medium">Dashboard:</span> {t.nav.dashboard}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">Common Actions</h4>
                  <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                    <div><span className="font-medium">Search:</span> {t.common.search}</div>
                    <div><span className="font-medium">Filter:</span> {t.common.filter}</div>
                    <div><span className="font-medium">Save:</span> {t.common.save}</div>
                    <div><span className="font-medium">Cancel:</span> {t.common.cancel}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">Property Terms</h4>
                  <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                    <div><span className="font-medium">Bedrooms:</span> {t.property.bedrooms}</div>
                    <div><span className="font-medium">Bathrooms:</span> {t.property.bathrooms}</div>
                    <div><span className="font-medium">Available:</span> {t.property.available}</div>
                    <div><span className="font-medium">Book Now:</span> {t.property.bookNow}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">Booking Process</h4>
                  <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                    <div><span className="font-medium">Check In:</span> {t.booking.checkIn}</div>
                    <div><span className="font-medium">Check Out:</span> {t.booking.checkOut}</div>
                    <div><span className="font-medium">Total Price:</span> {t.booking.totalPrice}</div>
                    <div><span className="font-medium">Confirm:</span> {t.booking.confirmBooking}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4 text-primary" weight="fill" />
            <span>Your language preference is automatically saved</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
