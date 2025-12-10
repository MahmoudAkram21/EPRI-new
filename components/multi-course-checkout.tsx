"use client"

import { useState, useEffect, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, Loader2, CreditCard, Banknote, MapPin, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { useUser } from "@/contexts/user-context"
import Image from "next/image"

type TranslationObject = { en: string; ar: string } | string

function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

interface Course {
  id: string
  title: string | TranslationObject
  price: number
  is_free: boolean
  image?: string
  delivery_type: 'ONLINE' | 'OFFLINE' | 'HYBRID'
}

interface MultiCourseCheckoutProps {
  courses: Course[]
  onClose: () => void
  onSuccess?: () => void
}

export function MultiCourseCheckout({ courses, onClose, onSuccess }: MultiCourseCheckoutProps) {
  const locale = useLocale()
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('USD')
  const [paymentMethod, setPaymentMethod] = useState<string>('online')
  const [loading, setLoading] = useState(false)
  const [userCountry, setUserCountry] = useState<string | null>(null)

  // Detect user country from profile or IP
  useEffect(() => {
    const detectCountry = async () => {
      // First try to get from user profile
      if (user?.country) {
        const countryStr = typeof user.country === 'string' ? user.country : getTranslation(user.country, locale)
        setUserCountry(countryStr)
        // If user is from Egypt, use EGP
        if (countryStr.toLowerCase().includes('egypt') || countryStr.toLowerCase().includes('مصر')) {
          setCurrency('EGP')
        } else {
          setCurrency('USD')
        }
        return
      }

      // Fallback to IP-based detection
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        if (data.country_name) {
          setUserCountry(data.country_name)
          if (data.country_name.toLowerCase() === 'egypt' || data.country_code === 'EG') {
            setCurrency('EGP')
          } else {
            setCurrency('USD')
          }
        }
      } catch (err) {
        console.error('Failed to detect country:', err)
        // Default to USD if detection fails
        setCurrency('USD')
      }
    }

    detectCountry()
  }, [user, locale])

  // Calculate totals
  const totals = useMemo(() => {
    const freeCourses = courses.filter(c => c.is_free)
    const paidCourses = courses.filter(c => !c.is_free)
    const subtotal = paidCourses.reduce((sum, course) => sum + course.price, 0)
    
    // Convert to selected currency if needed
    // For now, assuming prices are in USD, convert to EGP if needed
    const exchangeRate = 30 // Approximate EGP/USD rate - should come from API
    const subtotalInCurrency = currency === 'EGP' ? subtotal * exchangeRate : subtotal
    
    return {
      freeCount: freeCourses.length,
      paidCount: paidCourses.length,
      subtotal,
      subtotalInCurrency,
      total: subtotalInCurrency,
      currency
    }
  }, [courses, currency])

  const handleCheckout = async () => {
    if (courses.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one course",
        variant: "destructive"
      })
      return
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      // Create multi-course order
      const orderData = {
        courses: courses.map(c => ({
          course_id: c.id,
          price: c.is_free ? 0 : c.price,
          currency: currency
        })),
        total_amount: totals.total,
        currency: currency,
        country: userCountry,
        payment_method: paymentMethod
      }

      const response = await apiClient.createMultiCourseOrder(orderData)
      
      toast({
        title: "Success!",
        description: paymentMethod === 'cash_on_attendance' 
          ? t('checkout.cashPaymentSuccess')
          : t('checkout.paymentSuccess'),
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/dashboard/my-courses`)
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast({
        title: "Error",
        description: error.message || t('checkout.paymentError'),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">{t('checkout.title')}</CardTitle>
            <CardDescription>{t('checkout.description')}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Selected Courses */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('checkout.selectedCourses')} ({courses.length})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  {course.image && (
                    <div className="relative h-16 w-24 shrink-0 rounded overflow-hidden">
                      <Image
                        src={course.image}
                        alt={getTranslation(course.title, locale)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-1">
                      {getTranslation(course.title, locale)}
                    </h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      {course.delivery_type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    {course.is_free ? (
                      <Badge className="bg-emerald-500">Free</Badge>
                    ) : (
                      <div>
                        <div className="font-semibold">
                          {currency === 'EGP' 
                            ? `${(course.price * 30).toFixed(2)} EGP`
                            : `$${course.price.toFixed(2)}`}
                        </div>
                        {currency === 'EGP' && (
                          <div className="text-xs text-slate-500">≈ ${course.price.toFixed(2)}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Currency Display */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold">{t('checkout.currency')}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {userCountry ? `${t('checkout.detectedCountry')}: ${userCountry}` : t('checkout.autoDetected')}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {currency}
            </Badge>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('checkout.paymentMethod')}</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{t('checkout.onlinePayment')}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {t('checkout.onlinePaymentDesc')}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="cash_on_attendance" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{t('checkout.cashOnAttendance')}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {t('checkout.cashOnAttendanceDesc')}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="bank_transfer" id="bank" />
                  <Label htmlFor="bank" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{t('checkout.bankTransfer')}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {t('checkout.bankTransferDesc')}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('checkout.freeCourses')}</span>
              <span>{totals.freeCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('checkout.paidCourses')}</span>
              <span>{totals.paidCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('checkout.subtotal')}</span>
              <span>
                {currency === 'EGP' 
                  ? `${totals.subtotalInCurrency.toFixed(2)} EGP`
                  : `$${totals.subtotal.toFixed(2)}`}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t('checkout.total')}</span>
              <span className="text-primary">
                {currency === 'EGP' 
                  ? `${totals.total.toFixed(2)} EGP`
                  : `$${totals.subtotal.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleCheckout}
            disabled={loading || courses.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('checkout.processing')}
              </>
            ) : (
              <>
                {paymentMethod === 'cash_on_attendance' 
                  ? t('checkout.confirmReservation')
                  : t('checkout.proceedToPayment')}
              </>
            )}
          </Button>

          {paymentMethod === 'cash_on_attendance' && (
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              {t('checkout.cashPaymentNote')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

