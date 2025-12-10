'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Filter, DollarSign, CheckCircle2, XCircle, Clock, User, BookOpen, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { apiClient } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { useUser } from '@/contexts/user-context'
import Link from 'next/link'

interface CourseOrder {
  id: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  course: {
    id: string
    title: string | { en: string; ar: string }
    price: number
    is_free: boolean
  }
  payment_status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'
  total_amount: number
  payment_method?: string
  transaction_id?: string
  receipt_url?: string
  verified_at?: string
  notes?: string
  created_at: string
  updated_at?: string
}

// Helper function to extract localized value from Json field
const extractLocalizedValue = (value: any, locale: string = 'en'): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    if (value[locale]) return value[locale]
    if (value.en) return value.en
    if (value.ar) return value.ar
    return JSON.stringify(value)
  }
  return String(value)
}

export default function DepartmentCourseOrdersPage() {
  const locale = useLocale()
  const router = useRouter()
  const { user } = useUser()
  const [orders, setOrders] = useState<CourseOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<CourseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [editingOrder, setEditingOrder] = useState<CourseOrder | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editFormData, setEditFormData] = useState({
    payment_status: 'PENDING' as 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED',
    verified_at: '',
    notes: ''
  })

  useEffect(() => {
    // Check if user is department manager
    if (!user || user.role !== 'DEPARTMENT_MANAGER') {
      router.push('/dashboard')
      return
    }
    fetchOrders()
  }, [user, router])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, paymentStatusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAdminCourseOrders()
      setOrders(response.orders || [])
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch course orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order => {
        const userName = `${order.user.first_name} ${order.user.last_name}`.toLowerCase()
        const userEmail = order.user.email.toLowerCase()
        const courseTitle = extractLocalizedValue(order.course.title, locale as string).toLowerCase()
        return userName.includes(searchTerm.toLowerCase()) ||
          userEmail.includes(searchTerm.toLowerCase()) ||
          courseTitle.includes(searchTerm.toLowerCase()) ||
          order.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === paymentStatusFilter)
    }

    setFilteredOrders(filtered)
  }

  const handleEdit = (order: CourseOrder) => {
    setEditingOrder(order)
    setEditFormData({
      payment_status: order.payment_status,
      verified_at: order.verified_at ? new Date(order.verified_at).toISOString().split('T')[0] : '',
      notes: order.notes || ''
    })
    setShowEditDialog(true)
  }

  const handleSaveOrder = async () => {
    if (!editingOrder) return

    try {
      await apiClient.updateAdminCourseOrder(editingOrder.id, {
        payment_status: editFormData.payment_status,
        verified_at: editFormData.verified_at || null,
        notes: editFormData.notes || undefined
      })
      toast({
        title: "Success",
        description: "Order updated successfully",
      })
      setShowEditDialog(false)
      setEditingOrder(null)
      fetchOrders()
    } catch (error: any) {
      console.error('Error updating order:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update order",
        variant: "destructive",
      })
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      case 'REFUNDED':
        return <Badge className="bg-gray-100 text-gray-800"><DollarSign className="h-3 w-3 mr-1" />Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalRevenue = orders
    .filter(o => o.payment_status === 'PAID')
    .reduce((sum, order) => sum + Number(order.total_amount), 0)

  const pendingOrders = orders.filter(o => o.payment_status === 'PENDING').length
  const paidOrders = orders.filter(o => o.payment_status === 'PAID').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/department">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Course Orders</h1>
            <p className="text-gray-600 mt-2">View and manage course purchase orders for your department</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by student name, email, course, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm || paymentStatusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No course orders yet for your department'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Order Header */}
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">
                                {extractLocalizedValue(order.course.title, locale)}
                              </h3>
                              {getPaymentStatusBadge(order.payment_status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Order ID: {order.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {order.user.first_name} {order.user.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">{order.user.email}</p>
                              {order.user.phone && (
                                <p className="text-xs text-muted-foreground">{order.user.phone}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                ${Number(order.total_amount).toFixed(2)}
                              </p>
                              {order.payment_method && (
                                <p className="text-xs text-muted-foreground">
                                  Payment: {order.payment_method}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        {(order.transaction_id || order.receipt_url || order.notes) && (
                          <div className="pt-2 border-t space-y-2">
                            {order.transaction_id && (
                              <p className="text-sm text-muted-foreground">
                                Transaction ID: <span className="font-mono">{order.transaction_id}</span>
                              </p>
                            )}
                            {order.receipt_url && (
                              <a 
                                href={order.receipt_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                View Receipt
                              </a>
                            )}
                            {order.verified_at && (
                              <p className="text-sm text-muted-foreground">
                                Verified: {new Date(order.verified_at).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                              </p>
                            )}
                            {order.notes && (
                              <p className="text-sm text-muted-foreground">
                                Notes: {order.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          Edit Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Order Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update the payment status and verification details for this order
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="payment_status">Payment Status</Label>
              <Select
                value={editFormData.payment_status}
                onValueChange={(value: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED') => 
                  setEditFormData(prev => ({ ...prev, payment_status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="verified_at">Verified At (Date)</Label>
              <Input
                id="verified_at"
                type="date"
                value={editFormData.verified_at}
                onChange={(e) => setEditFormData(prev => ({ ...prev, verified_at: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this order"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveOrder}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

