"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3002;
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'EPRI Backend API is running',
        timestamp: new Date().toISOString()
    });
});
app.post('/api/auth/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, role = 'STUDENT' } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                message: 'First name, last name, email, and password are required'
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long'
            });
        }
        if (role === 'ADMIN') {
            return res.status(400).json({
                message: 'Cannot register with ADMIN role'
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const saltRounds = 12;
        const password_hash = await bcryptjs_1.default.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                password_hash,
                phone,
                role: role,
                is_verified: false
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                role: true,
                is_verified: true,
                created_at: true
            }
        });
        return res.status(201).json({
            message: 'User registered successfully. Account is pending verification.',
            user
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash || '');
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.is_verified) {
            return res.status(403).json({
                message: 'Account pending verification. Please wait for administrator approval.',
                code: 'ACCOUNT_PENDING'
            });
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, jwtSecret, { expiresIn: '7d' });
        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                is_verified: user.is_verified
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/auth/profile', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                role: true,
                is_verified: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ user });
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
});
app.get('/api/auth/verify', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        return res.json({
            message: 'Token is valid',
            user: {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            }
        });
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
});
app.get('/api/events', (req, res) => {
    res.json({
        events: [],
        message: 'Events endpoint - ready for implementation',
        query: req.query
    });
});
app.get('/api/admin/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                categories: {
                    include: {
                        category: true
                    }
                },
                address: true,
                speakers: true,
                orders: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                email: true
                            }
                        }
                    }
                },
                tickets: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return res.json({
            events,
            total: events.length
        });
    }
    catch (error) {
        console.error('Admin events fetch error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                role: true,
                is_verified: true,
                created_at: true,
                event_orders: {
                    include: {
                        event: {
                            select: {
                                id: true,
                                title: true,
                                start_date: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return res.json({
            users,
            total: users.length
        });
    }
    catch (error) {
        console.error('Admin users fetch error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/admin/event-requests', async (req, res) => {
    try {
        const eventRequests = await prisma.eventOrder.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                        phone: true
                    }
                },
                event: {
                    select: {
                        id: true,
                        title: true,
                        start_date: true,
                        end_date: true,
                        price: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return res.json({
            requests: eventRequests,
            total: eventRequests.length
        });
    }
    catch (error) {
        console.error('Admin event requests fetch error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/api/admin/events', async (req, res) => {
    try {
        const { title, description, start_date, end_date, price, capacity, status, address_id, featured, registration_open, is_conference, cover_image, agenda, guidelines, category_ids, speaker_ids } = req.body;
        const event = await prisma.event.create({
            data: {
                title,
                description,
                start_date: new Date(start_date),
                end_date: end_date ? new Date(end_date) : null,
                price: parseFloat(price) || 0,
                capacity: parseInt(capacity) || 100,
                status: status || 'PUBLISHED',
                featured: featured || false,
                registration_open: registration_open !== false,
                is_conference: is_conference || false,
                cover_image: cover_image || null,
                agenda: agenda ? (typeof agenda === 'string' ? JSON.parse(agenda) : agenda) : null,
                guidelines: guidelines || null,
                ...(address_id && { address_id }),
                categories: category_ids ? {
                    create: category_ids.map((categoryId) => ({
                        category_id: categoryId
                    }))
                } : undefined,
                speakers: speaker_ids ? {
                    connect: speaker_ids.map((speakerId) => ({
                        id: speakerId
                    }))
                } : undefined
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                },
                address: true,
                speakers: true
            }
        });
        return res.status(201).json({
            message: 'Event created successfully',
            event
        });
    }
    catch (error) {
        console.error('Create event error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.put('/api/admin/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, start_date, end_date, price, capacity, status, address_id, featured, registration_open, is_conference, cover_image, agenda, guidelines } = req.body;
        if (is_conference) {
            const existingConference = await prisma.event.findFirst({
                where: {
                    is_conference: true,
                    id: { not: id }
                }
            });
            if (existingConference) {
                await prisma.event.update({
                    where: { id: existingConference.id },
                    data: { is_conference: false }
                });
            }
        }
        const event = await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : undefined,
                price: price ? parseFloat(price) : undefined,
                capacity: capacity ? parseInt(capacity) : undefined,
                status,
                featured,
                registration_open,
                is_conference,
                cover_image,
                agenda: typeof agenda === 'undefined' ? undefined : (agenda ? (typeof agenda === 'string' ? JSON.parse(agenda) : agenda) : null),
                guidelines,
                ...(address_id && { address_id })
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                },
                address: true,
                speakers: true
            }
        });
        return res.json({
            message: 'Event updated successfully',
            event
        });
    }
    catch (error) {
        console.error('Update event error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.delete('/api/admin/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.event.delete({
            where: { id }
        });
        return res.json({
            message: 'Event deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete event error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.put('/api/admin/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                role: true,
                is_verified: true
            }
        });
        return res.json({
            message: 'User role updated successfully',
            user
        });
    }
    catch (error) {
        console.error('Update user role error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.put('/api/admin/users/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_verified } = req.body;
        const user = await prisma.user.update({
            where: { id },
            data: { is_verified },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                role: true,
                is_verified: true
            }
        });
        return res.json({
            message: 'User verification status updated successfully',
            user
        });
    }
    catch (error) {
        console.error('Update user verification error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/api/admin/users', async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, role = 'STUDENT', is_verified = false } = req.body;
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                message: 'First name, last name, and email are required'
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        let password_hash = null;
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters long'
                });
            }
            const saltRounds = 12;
            password_hash = await bcryptjs_1.default.hash(password, saltRounds);
        }
        const user = await prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                password_hash,
                phone,
                role: role,
                is_verified
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                role: true,
                is_verified: true,
                created_at: true,
                updated_at: true
            }
        });
        return res.status(201).json({
            message: 'User created successfully',
            user
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.put('/api/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, password, phone, role, is_verified } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updateData = {};
        if (first_name !== undefined)
            updateData.first_name = first_name;
        if (last_name !== undefined)
            updateData.last_name = last_name;
        if (phone !== undefined)
            updateData.phone = phone;
        if (role !== undefined)
            updateData.role = role;
        if (is_verified !== undefined)
            updateData.is_verified = is_verified;
        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email }
            });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            updateData.email = email;
        }
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters long'
                });
            }
            const saltRounds = 12;
            updateData.password_hash = await bcryptjs_1.default.hash(password, saltRounds);
        }
        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                role: true,
                is_verified: true,
                created_at: true,
                updated_at: true
            }
        });
        return res.json({
            message: 'User updated successfully',
            user
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                role: true,
                is_verified: true,
                created_at: true,
                updated_at: true,
                event_orders: {
                    include: {
                        event: {
                            select: {
                                id: true,
                                title: true,
                                start_date: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ user });
    }
    catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await prisma.user.delete({
            where: { id }
        });
        return res.json({
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/admin/stats', async (req, res) => {
    try {
        const [totalUsers, totalEvents, totalEventRequests, pendingRequests, verifiedUsers, recentEvents] = await Promise.all([
            prisma.user.count(),
            prisma.event.count(),
            prisma.eventOrder.count(),
            prisma.eventOrder.count({
                where: {
                    payment_status: 'PENDING'
                }
            }),
            prisma.user.count({
                where: {
                    is_verified: true
                }
            }),
            prisma.event.count({
                where: {
                    start_date: {
                        gte: new Date()
                    }
                }
            })
        ]);
        return res.json({
            stats: {
                totalUsers,
                totalEvents,
                totalEventRequests,
                pendingRequests,
                verifiedUsers,
                recentEvents
            }
        });
    }
    catch (error) {
        console.error('Admin stats error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.listen(port, () => {
    console.log(`🚀 EPRI Backend server running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
    console.log(`🔐 Auth endpoints ready: /api/auth/*`);
});
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=server-auth.js.map