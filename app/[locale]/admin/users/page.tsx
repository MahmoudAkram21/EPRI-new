'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users as UsersIcon, 
  Search, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Crown,
  Clock,
  X
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  is_verified: boolean;
  plan_type: string | null;
  plan_start_date: string | null;
  plan_end_date: string | null;
  is_trial_active: boolean;
  trial_start_date: string | null;
  trial_end_date: string | null;
  created_at: string;
  event_orders: any[];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiClient.getAdminUsers();
      setUsers(data.users);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await apiClient.updateAdminUserRole(userId, newRole);
      toast({
        title: 'Success',
        description: 'User role updated',
      });
      loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const handleVerificationToggle = async (userId: string, isVerified: boolean) => {
    try {
      await apiClient.updateAdminUserVerification(userId, !isVerified);
      toast({
        title: 'Success',
        description: `User ${!isVerified ? 'verified' : 'unverified'}`,
      });
      loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePlan = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user\'s plan?')) {
      return;
    }
    try {
      await apiClient.removeUserPlan(userId);
      toast({
        title: 'Success',
        description: 'User plan removed successfully',
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove user plan',
        variant: 'destructive',
      });
    }
  };

  const handleStopTrial = async (userId: string) => {
    if (!confirm('Are you sure you want to stop this user\'s free trial?')) {
      return;
    }
    try {
      await apiClient.stopUserTrial(userId);
      toast({
        title: 'Success',
        description: 'User free trial stopped successfully',
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to stop user trial',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage all users in the system</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="RESEARCHER">Researcher</SelectItem>
                <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan/Trial</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/avatars/${user.id}.jpg`} />
                        <AvatarFallback>
                          {user.first_name[0]}{user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(value) => handleRoleUpdate(user.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="RESEARCHER">Researcher</SelectItem>
                        <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user.plan_type && (
                        <div className="flex items-center gap-2">
                          <Crown className="h-3 w-3 text-yellow-500" />
                          <Badge variant="outline" className="text-xs">
                            {user.plan_type}
                          </Badge>
                          {user.plan_end_date && (
                            <span className="text-xs text-gray-500">
                              until {new Date(user.plan_end_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                      {user.is_trial_active && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            Trial Active
                          </Badge>
                          {user.trial_end_date && (
                            <span className="text-xs text-gray-500">
                              until {new Date(user.trial_end_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                      {!user.plan_type && !user.is_trial_active && (
                        <span className="text-xs text-gray-400">No plan</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerificationToggle(user.id, user.is_verified)}
                    >
                      {user.is_verified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.event_orders.length}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/users/${user.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {user.plan_type && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePlan(user.id)}
                          title="Remove Plan"
                        >
                          <Crown className="h-4 w-4 text-yellow-500" />
                        </Button>
                      )}
                      {user.is_trial_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStopTrial(user.id)}
                          title="Stop Trial"
                        >
                          <Clock className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
