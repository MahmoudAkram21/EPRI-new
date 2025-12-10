'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Mail, 
  Phone, 
  GraduationCap, 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  UserCheck,
  Loader2
} from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'

interface Staff {
  id: string
  name: string
  title: string
  academic_position?: string
  current_admin_position?: string
  ex_admin_position?: string
  scientific_name?: string
  picture?: string
  bio?: string
  research_interests?: string
  email?: string
  alternative_email?: string
  phone?: string
  mobile?: string
  website?: string
  office_location?: string
  office_hours?: string
  publications_count?: number
  papers_count?: number
  abstracts_count?: number
  created_at: string
  updated_at?: string
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAdminStaff()
      setStaff(response.staff)
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to load staff',
        variant: 'destructive',
      })
      console.error('Error fetching staff:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStaff = async (staffId: string, staffName: string) => {
    if (!confirm(`Are you sure you want to delete ${staffName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(staffId);
      await apiClient.deleteAdminStaff(staffId);
      
      // Remove from local state
      setStaff(prev => prev.filter(member => member.id !== staffId));
      
      toast({
        title: 'Success',
        description: `${staffName} has been deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete staff member',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage staff members, their profiles, and department assignments</p>
        </div>
        <Button asChild>
          <Link href="/admin/staff/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Academic Staff</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.academic_position).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Positions</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.current_admin_position).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <Mail className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Email</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.email).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-md -mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search staff by name, title, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Staff ({filteredStaff.length})</CardTitle>
          <CardDescription>
            View and manage all staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No matching staff found' : 'No staff members yet'}
              </p>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <Link href="/admin/staff/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Positions</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Publications</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0">
                          <Image
                            src={member.picture || "/placeholder.svg"}
                            alt={member.name}
                            fill
                            className="object-cover rounded-full ring-2 ring-gray-200"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.title}</div>
                          {member.scientific_name && (
                            <div className="text-xs text-gray-400">{member.scientific_name}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        {member.academic_position && (
                          <Badge variant="outline" className="text-xs">
                            {member.academic_position}
                          </Badge>
                        )}
                        {member.current_admin_position && (
                          <Badge variant="secondary" className="text-xs">
                            {member.current_admin_position}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        {member.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{member.email}</span>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div>Pubs: {member.publications_count || 0}</div>
                        <div>Papers: {member.papers_count || 0}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/staff/${member.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/staff/${member.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteStaff(member.id, member.name)}
                          disabled={deletingId === member.id}
                        >
                          {deletingId === member.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}