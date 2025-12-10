"use client"

import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Mail, Shield, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PendingVerificationPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // If user is verified, redirect to dashboard
    if (!isLoading && user && user.is_verified) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  return (
    <PageContainer>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-amber-100 p-4">
                    <Clock className="h-12 w-12 text-amber-600 animate-pulse" />
                  </div>
                </div>
                <CardTitle className="text-3xl mb-2">Account Pending Verification</CardTitle>
                <CardDescription className="text-base">
                  Your account is waiting for administrator approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-amber-200">
                    <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">What's Next?</h3>
                      <p className="text-sm text-gray-600">
                        An administrator will review your registration and verify your account. 
                        You will receive an email notification once your account has been approved.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-amber-200">
                    <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Why Verification?</h3>
                      <p className="text-sm text-gray-600">
                        We verify all accounts to ensure security and maintain a safe environment 
                        for all EPRI members. This process typically takes 24-48 hours.
                      </p>
                    </div>
                  </div>

                  {user && (
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Your Information</h3>
                        <p className="text-sm text-gray-700">
                          <strong>Name:</strong> {user.first_name} {user.last_name}<br />
                          <strong>Email:</strong> {user.email}<br />
                          <strong>Role:</strong> {user.role}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex-1"
                  >
                    <Link href="/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Link>
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => window.location.reload()}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Check Status
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    If you have any questions, please contact{" "}
                    <a href="mailto:admin@epri.edu" className="text-primary hover:underline">
                      admin@epri.edu
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageContainer>
  )
}

