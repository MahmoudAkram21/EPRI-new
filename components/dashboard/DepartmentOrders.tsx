'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, DollarSign } from 'lucide-react';

interface DepartmentOrder {
    id: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    items: {
        course: {
            title: string | { en: string; ar: string };
            price: number;
        };
    }[];
    total_amount: number;
    payment_status: string;
    created_at: Date;
}

export function DepartmentOrders() {
    const [orders, setOrders] = useState<DepartmentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartmentOrders();
    }, []);

    const fetchDepartmentOrders = async () => {
        try {
            const response = await fetch('/api/department-orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching department orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTranslation = (value: any) => {
        if (typeof value === 'string') return value;
        return value?.en || value?.ar || '';
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'paid':
                return <Badge variant="default" className="bg-green-600">Paid</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <ShoppingCart className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Department Course Orders</h2>
                    <p className="text-sm text-muted-foreground">
                        View all course orders from students in your department
                    </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-sm font-medium">{orders.length} orders</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <Card className="p-12 text-center">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold text-xl mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground">
                        Course orders from your department will appear here
                    </p>
                </Card>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Course(s)</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">
                                        {order.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">
                                                {order.user.first_name} {order.user.last_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.user.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="text-sm">
                                                    {getTranslation(item.course.title)}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${order.total_amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(order.payment_status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {/* Summary Stats */}
            {orders.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{orders.length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">
                                    ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => {
                                        const orderDate = new Date(o.created_at);
                                        const now = new Date();
                                        return orderDate.getMonth() === now.getMonth() &&
                                            orderDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
