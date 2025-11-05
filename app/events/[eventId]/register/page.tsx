"use client"

import { useState, use } from "react"
import { events } from "@/lib/data"
import { notFound, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Clock, DollarSign, CheckCircle2, Upload, File, X, CreditCard, Building2, Smartphone, Globe, Copy, Check, AlertCircle, Info, ArrowRight, ArrowLeft, User2, FileText } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function ConferenceRegisterPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = use(params)
  const event = events.find((e) => e.id === resolvedParams.eventId)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    jobTitle: "",
  })

  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1 as number)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')

  // Step constants
  const STEP_PERSONAL = 1
  const STEP_PAYMENT = 2
  const STEP_RECEIPT = 3

  if (!event) {
    notFound()
  }

  if (!event.isConference) {
    router.push(`/events/${event.id}`)
    return null
  }

  const availableSpots = event.capacity - event.registered
  const isFull = availableSpots <= 0

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPG, PNG, or PDF file",
          variant: "destructive",
        })
        return
      }

      setReceiptFile(file)
    }
  }

  const removeReceipt = () => {
    setReceiptFile(null)
    // Reset file input
    const fileInput = document.getElementById('receipt') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast({
        title: "Copied!",
        description: "Payment details copied to clipboard",
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the details manually",
        variant: "destructive",
      })
    }
  }

  const nextStep = () => {
    if (currentStep < STEP_RECEIPT) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > STEP_PERSONAL) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === STEP_PERSONAL) {
      // Validate step 1 (personal information)
      if (isPersonalInfoValid) {
        nextStep()
      }
    } else if (currentStep === STEP_PAYMENT) {
      // Validate step 2 (payment method selection)
      if (selectedPaymentMethod) {
        nextStep()
      } else {
        toast({
          title: "Payment method required",
          description: "Please select a payment method to continue",
          variant: "destructive",
        })
      }
    } else if (currentStep === STEP_RECEIPT) {
      // Final submission
      handleSubmit(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate ticket number
    const ticketNumber = `EPRI-${event.id.toUpperCase()}-${Date.now().toString().slice(-6)}`

    // Store registration in localStorage
    const registration = {
      id: Date.now().toString(),
      eventId: event.id,
      attendeeName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      jobTitle: formData.jobTitle,
      ticketNumber,
      registrationDate: new Date().toISOString(),
      paymentStatus: "completed" as const,
    }

    localStorage.setItem(`registration-${ticketNumber}`, JSON.stringify(registration))

    setIsSubmitting(false)

    toast({
      title: "Registration Successful!",
      description: "Redirecting to your ticket...",
    })

    // Redirect to ticket page
    setTimeout(() => {
      router.push(`/events/${event.id}/ticket/${ticketNumber}`)
    }, 1000)
  }

  // Step validations
  const isPersonalInfoValid = formData.fullName.trim() && 
                             formData.email.trim() && 
                             formData.phone.trim() && 
                             formData.organization.trim() && 
                             formData.jobTitle.trim() && 
                             /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && 
                             formData.phone.length >= 10

  const isPaymentMethodValid = selectedPaymentMethod !== ''
  
  const isReceiptValid = receiptFile !== null

  // Overall form validation
  const isFormValid = isPersonalInfoValid && isPaymentMethodValid && isReceiptValid

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative">
        <div className="relative h-[300px] -mx-4 md:-mx-6 lg:-mx-8 mb-12">
          <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <AnimatedSection animation="fade-up">
                <Badge variant="secondary" className="mb-3">
                  {event.category}
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
                <p className="text-lg text-white/90">Conference Registration</p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Multi-Step Registration Form */}
          <div className="lg:col-span-2">
            <AnimatedSection animation="fade-up">
              <Card>
                <CardHeader className="pb-6">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {/* Step 1 */}
                      <div className={`flex items-center space-x-2 ${currentStep >= STEP_PERSONAL ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep > STEP_PERSONAL ? 'bg-primary text-primary-foreground' : 
                          currentStep === STEP_PERSONAL ? 'bg-primary text-primary-foreground' : 
                          'bg-muted text-muted-foreground'
                        }`}>
                          {currentStep > STEP_PERSONAL ? <Check className="h-4 w-4" /> : '1'}
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Personal Info</span>
                      </div>
                      
                      {/* Connector */}
                      <div className={`w-8 h-0.5 ${currentStep > STEP_PERSONAL ? 'bg-primary' : 'bg-muted'}`} />
                      
                      {/* Step 2 */}
                      <div className={`flex items-center space-x-2 ${currentStep >= STEP_PAYMENT ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep > STEP_PAYMENT ? 'bg-primary text-primary-foreground' : 
                          currentStep === STEP_PAYMENT ? 'bg-primary text-primary-foreground' : 
                          'bg-muted text-muted-foreground'
                        }`}>
                          {currentStep > STEP_PAYMENT ? <Check className="h-4 w-4" /> : '2'}
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Payment Method</span>
                      </div>
                      
                      {/* Connector */}
                      <div className={`w-8 h-0.5 ${currentStep > STEP_PAYMENT ? 'bg-primary' : 'bg-muted'}`} />
                      
                      {/* Step 3 */}
                      <div className={`flex items-center space-x-2 ${currentStep >= STEP_RECEIPT ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep === STEP_RECEIPT ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          3
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Upload Receipt</span>
                      </div>
                    </div>
                  </div>

                  {/* Step Headers */}
                  <div className="space-y-2">
                    {currentStep === STEP_PERSONAL && (
                      <>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <User2 className="h-6 w-6 text-primary" />
                          Personal Information
                        </CardTitle>
                        <CardDescription>Tell us about yourself and your organization</CardDescription>
                      </>
                    )}
                    {currentStep === STEP_PAYMENT && (
                      <>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <CreditCard className="h-6 w-6 text-primary" />
                          Choose Payment Method
                        </CardTitle>
                        <CardDescription>Select your preferred payment option</CardDescription>
                      </>
                    )}
                    {currentStep === STEP_RECEIPT && (
                      <>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <FileText className="h-6 w-6 text-primary" />
                          Upload Payment Receipt
                        </CardTitle>
                        <CardDescription>Provide proof of payment to complete registration</CardDescription>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStepSubmit} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === STEP_PERSONAL && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              placeholder="Enter your full name"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "border-destructive" : ""}
                              required
                            />
                            {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                              <p className="text-xs text-destructive">Please enter a valid email address</p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={formData.phone && formData.phone.length < 10 ? "border-destructive" : ""}
                              required
                            />
                            {formData.phone && formData.phone.length < 10 && (
                              <p className="text-xs text-destructive">Phone number must be at least 10 digits</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title *</Label>
                            <Input
                              id="jobTitle"
                              name="jobTitle"
                              placeholder="Your job title"
                              value={formData.jobTitle}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization *</Label>
                          <Input
                            id="organization"
                            name="organization"
                            placeholder="Your company or organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <Separator />

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Registration includes:</h4>
                          <ul className="space-y-1">
                            {event.benefits?.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Payment Method Selection */}
                    {currentStep === STEP_PAYMENT && (
                      <div className="space-y-6">
                        <div className="grid gap-4">
                          {/* Bank Transfer Option */}
                          <div 
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedPaymentMethod === 'bank' 
                                ? 'border-primary bg-primary/5' 
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedPaymentMethod('bank')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Building2 className="h-6 w-6 text-primary" />
                                <div>
                                  <h3 className="font-semibold">Bank Transfer</h3>
                                  <p className="text-sm text-muted-foreground">Secure direct bank transfer</p>
                                </div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                selectedPaymentMethod === 'bank' 
                                  ? 'border-primary bg-primary' 
                                  : 'border-muted'
                              }`}>
                                {selectedPaymentMethod === 'bank' && (
                                  <div className="w-full h-full rounded-full bg-white scale-50" />
                                )}
                              </div>
                            </div>
                            
                            {selectedPaymentMethod === 'bank' && (
                              <div className="mt-4 space-y-3 border-t pt-4">
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex justify-between items-center p-3 bg-background rounded-md border">
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Bank Name</p>
                                      <p className="font-medium">National Bank of Egypt</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        copyToClipboard("National Bank of Egypt", "bank")
                                      }}
                                      className="h-8 w-8 p-0 hover:bg-primary/10"
                                    >
                                      {copiedField === "bank" ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  
                                  <div className="flex justify-between items-center p-3 bg-background rounded-md border">
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Number</p>
                                      <p className="font-medium font-mono">12345678901234</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        copyToClipboard("12345678901234", "account")
                                      }}
                                      className="h-8 w-8 p-0 hover:bg-primary/10"
                                    >
                                      {copiedField === "account" ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  
                                  <div className="flex justify-between items-center p-3 bg-background rounded-md border">
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Holder</p>
                                      <p className="font-medium">Egyptian Petroleum Research Institute</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        copyToClipboard("Egyptian Petroleum Research Institute", "holder")
                                      }}
                                      className="h-8 w-8 p-0 hover:bg-primary/10"
                                    >
                                      {copiedField === "holder" ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm text-blue-700 dark:text-blue-300">
                                    <p>Include your name and event ID: <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">{event.id.toUpperCase()}</span></p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Mobile Money Option */}
                          <div 
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedPaymentMethod === 'mobile' 
                                ? 'border-primary bg-primary/5' 
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedPaymentMethod('mobile')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Smartphone className="h-6 w-6 text-green-600" />
                                <div>
                                  <h3 className="font-semibold">Mobile Money</h3>
                                  <p className="text-sm text-muted-foreground">Vodafone Cash, Orange Money</p>
                                </div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                selectedPaymentMethod === 'mobile' 
                                  ? 'border-primary bg-primary' 
                                  : 'border-muted'
                              }`}>
                                {selectedPaymentMethod === 'mobile' && (
                                  <div className="w-full h-full rounded-full bg-white scale-50" />
                                )}
                              </div>
                            </div>
                            
                            {selectedPaymentMethod === 'mobile' && (
                              <div className="mt-4 space-y-3 border-t pt-4">
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex justify-between items-center p-3 bg-background rounded-md border">
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Vodafone Cash</p>
                                      <p className="font-medium font-mono">01234567890</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        copyToClipboard("01234567890", "vodafone")
                                      }}
                                      className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-950/20"
                                    >
                                      {copiedField === "vodafone" ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  
                                  <div className="flex justify-between items-center p-3 bg-background rounded-md border">
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Orange Money</p>
                                      <p className="font-medium font-mono">01123456789</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        copyToClipboard("01123456789", "orange")
                                      }}
                                      className="h-8 w-8 p-0 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                                    >
                                      {copiedField === "orange" ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Online Payment (Disabled) */}
                          <div className="border-2 border-muted rounded-lg p-4 opacity-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Globe className="h-6 w-6 text-purple-600" />
                                <div>
                                  <h3 className="font-semibold">Online Payment</h3>
                                  <p className="text-sm text-muted-foreground">Credit/Debit Cards (Coming Soon)</p>
                                </div>
                              </div>
                              <div className="w-4 h-4 rounded-full border-2 border-muted" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">${event.price || 0}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Processing fee: FREE</p>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Upload Receipt */}
                    {currentStep === STEP_RECEIPT && (
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">Almost Done!</h3>
                          <p className="text-muted-foreground">
                            {selectedPaymentMethod === 'bank' ? 'Complete your bank transfer and' : 
                             selectedPaymentMethod === 'mobile' ? 'Complete your mobile money payment and' : 
                             'Complete your payment and'} upload the receipt below
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label>Payment Receipt Upload *</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                            {!receiptFile ? (
                              <div className="text-center">
                                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <div className="space-y-2">
                                  <p className="text-lg font-medium">Upload payment receipt</p>
                                  <p className="text-sm text-muted-foreground">
                                    Upload a clear photo or scan of your payment receipt
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Accepted formats: JPG, PNG, PDF (max 10MB)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  id="receipt"
                                  accept="image/*,.pdf"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="lg"
                                  className="mt-4"
                                  onClick={() => document.getElementById('receipt')?.click()}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Choose File
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <File className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{receiptFile.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {(receiptFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeReceipt}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedPaymentMethod && (
                          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-blue-700 dark:text-blue-300">
                                <p className="font-medium mb-1">Payment Method: {
                                  selectedPaymentMethod === 'bank' ? 'Bank Transfer' :
                                  selectedPaymentMethod === 'mobile' ? 'Mobile Money' : 'Unknown'
                                }</p>
                                <p>Your registration will be confirmed once we verify your payment receipt.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === STEP_PERSONAL}
                        className={currentStep === STEP_PERSONAL ? 'invisible' : ''}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>

                      <div className="flex-1 ps-5 items-center gap-2 text-sm text-muted-foreground">
                        Step {currentStep} of 3
                      </div>

                      <Button
                        type="submit"
                        disabled={
                          (currentStep === STEP_PERSONAL && !isPersonalInfoValid) ||
                          (currentStep === STEP_PAYMENT && !selectedPaymentMethod) ||
                          (currentStep === STEP_RECEIPT && (!receiptFile || isSubmitting)) ||
                          isFull
                        }
                      >
                        {currentStep === STEP_RECEIPT ? (
                          isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </span>
                          ) : isFull ? (
                            "Event Full"
                          ) : (
                            `Complete Registration - $${event.price || 0}`
                          )
                        ) : (
                          <>
                            {currentStep === STEP_PERSONAL ? 'Continue to Payment' : 'Continue to Upload'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          {/* Event Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Availability</p>
                        <p className="text-sm text-muted-foreground">
                          {availableSpots} spots remaining of {event.capacity}
                        </p>
                        <div className="mt-2 w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Registration Fee</p>
                        <p className="text-2xl font-bold text-primary">${event.price || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {event.speakers && event.speakers.length > 0 && (
                <AnimatedSection animation="fade-up" delay={0.1}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Featured Speakers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {event.speakers.slice(0, 3).map((speaker) => (
                        <div key={speaker.id} className="flex items-start gap-3">
                          <div className="relative h-12 w-12 flex-shrink-0">
                            <Image
                              src={speaker.picture || "/placeholder.svg"}
                              alt={speaker.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{speaker.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{speaker.title}</p>
                          </div>
                        </div>
                      ))}
                      {event.speakers.length > 3 && (
                        <p className="text-sm text-muted-foreground">+{event.speakers.length - 3} more speakers</p>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}

