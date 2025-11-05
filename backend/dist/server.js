"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://epri.developteam.site',
    'http://epri.developteam.site:3000',
    'http://localhost:3000'
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.post('/api/auth/register', (req, res) => {
    res.json({ message: 'Registration endpoint - not implemented yet' });
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }
        let user;
        try {
            user = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() }
            });
        }
        catch (dbError) {
            console.error('Database error during login:', dbError);
            return res.status(500).json({ message: 'Database connection error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.password_hash || user.password_hash.trim() === '') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        let isValidPassword = false;
        try {
            isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        }
        catch (bcryptError) {
            console.error('Bcrypt comparison error:', bcryptError);
            return res.status(500).json({ message: 'Error validating password' });
        }
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.is_verified) {
            return res.status(403).json({
                message: 'Account pending verification. Please wait for administrator approval.',
                code: 'ACCOUNT_PENDING'
            });
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        let token;
        try {
            token = jsonwebtoken_1.default.sign({
                userId: user.id,
                email: user.email,
                role: user.role
            }, jwtSecret, { expiresIn: '7d' });
        }
        catch (jwtError) {
            console.error('JWT signing error:', jwtError);
            return res.status(500).json({ message: 'Error generating authentication token' });
        }
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
        console.error('Error stack:', error?.stack);
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
});
app.get('/api/events', (req, res) => {
    res.json({
        events: [],
        message: 'Events endpoint - not implemented yet'
    });
});
app.get('/api/department-sections', async (req, res) => {
    try {
        const sections = await prisma.departmentSection.findMany({
            orderBy: { order_index: 'asc' }
        });
        const sectionsWithCounts = await Promise.all(sections.map(async (s) => {
            const count = await prisma.department.count({ where: { section_id: s.id } });
            return {
                id: s.id,
                name: s.name,
                slug: s.slug,
                order_index: s.order_index,
                created_at: s.created_at,
                updated_at: s.updated_at,
                departments_count: count
            };
        }));
        res.json({ sections: sectionsWithCounts });
    }
    catch (err) {
        console.error('Error fetching department sections', err);
        console.error('Error stack:', err?.stack);
        res.status(500).json({
            message: 'Failed to fetch department sections',
            error: process.env.NODE_ENV === 'development' ? err?.message : undefined
        });
    }
});
app.get('/api/departments', async (req, res) => {
    try {
        const { sectionId } = req.query;
        const departments = await prisma.department.findMany({
            ...(sectionId ? { where: { section_id: sectionId } } : {}),
            orderBy: { created_at: 'desc' }
        });
        res.json({ departments });
    }
    catch (err) {
        console.error('Error fetching departments', err);
        res.status(500).json({ message: 'Failed to fetch departments' });
    }
});
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'EPRI Backend API is running',
        timestamp: new Date().toISOString()
    });
});
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Access token required' });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, is_verified: true }
        });
        if (!user || !user.is_verified) {
            res.status(401).json({ message: 'Invalid or unverified token' });
            return;
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
const requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
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
app.get('/api/admin/events', authenticateToken, requireAdmin, async (req, res) => {
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
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
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
                    select: {
                        id: true,
                        event_id: true,
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
        console.error('Error stack:', error?.stack);
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
});
app.get('/api/admin/event-requests', authenticateToken, requireAdmin, async (req, res) => {
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
app.get('/api/admin/departments', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            include: {
                section: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return res.json({
            departments,
            total: departments.length
        });
    }
    catch (error) {
        console.error('Admin departments fetch error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/admin/departments/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Department ID is required' });
        }
        const department = await prisma.department.findUnique({
            where: { id },
            include: {
                section: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        return res.json({ department });
    }
    catch (error) {
        console.error('Admin department fetch error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/api/admin/departments', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description, image, icon, section_id, manager_id } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Department name is required' });
        }
        const department = await prisma.department.create({
            data: {
                name,
                description: description || null,
                image: image || null,
                icon: icon || null,
                section_id: section_id || null,
                manager_id: manager_id || null
            },
            include: {
                section: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });
        return res.json({
            message: 'Department created successfully',
            department
        });
    }
    catch (error) {
        console.error('Admin department create error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
});
app.put('/api/admin/departments/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Department ID is required' });
        }
        const { name, description, image, icon, section_id, manager_id } = req.body;
        const existingDepartment = await prisma.department.findUnique({
            where: { id }
        });
        if (!existingDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        const department = await prisma.department.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description: description || null }),
                ...(image !== undefined && { image: image || null }),
                ...(icon !== undefined && { icon: icon || null }),
                ...(section_id !== undefined && { section_id: section_id || null }),
                ...(manager_id !== undefined && { manager_id: manager_id || null })
            },
            include: {
                section: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });
        return res.json({
            message: 'Department updated successfully',
            department
        });
    }
    catch (error) {
        console.error('Admin department update error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
});
app.delete('/api/admin/departments/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Department ID is required' });
        }
        const existingDepartment = await prisma.department.findUnique({
            where: { id }
        });
        if (!existingDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        await prisma.department.delete({
            where: { id }
        });
        return res.json({
            message: 'Department deleted successfully'
        });
    }
    catch (error) {
        console.error('Admin department delete error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
});
app.get('/api/admin/department-sections', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const sections = await prisma.departmentSection.findMany({
            include: {
                _count: {
                    select: {
                        departments: true
                    }
                }
            },
            orderBy: {
                order_index: 'asc'
            }
        });
        const sectionsWithCounts = sections.map(section => ({
            id: section.id,
            name: section.name,
            slug: section.slug,
            order_index: section.order_index,
            created_at: section.created_at,
            updated_at: section.updated_at,
            departments_count: section._count.departments
        }));
        return res.json({
            sections: sectionsWithCounts,
            total: sections.length
        });
    }
    catch (error) {
        console.error('Admin department sections fetch error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/admin/department-sections/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Section ID is required' });
        }
        const section = await prisma.departmentSection.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        departments: true
                    }
                }
            }
        });
        if (!section) {
            return res.status(404).json({ message: 'Department section not found' });
        }
        const sectionWithCount = {
            id: section.id,
            name: section.name,
            slug: section.slug,
            order_index: section.order_index,
            created_at: section.created_at,
            updated_at: section.updated_at,
            departments_count: section._count.departments
        };
        return res.json({ section: sectionWithCount });
    }
    catch (error) {
        console.error('Admin department section fetch error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/api/admin/department-sections', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, slug, order_index } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Section name is required' });
        }
        const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const existingSection = await prisma.departmentSection.findUnique({
            where: { slug: finalSlug }
        });
        if (existingSection) {
            return res.status(400).json({ message: 'A section with this slug already exists' });
        }
        const section = await prisma.departmentSection.create({
            data: {
                name,
                slug: finalSlug,
                order_index: order_index || 0
            },
            include: {
                _count: {
                    select: {
                        departments: true
                    }
                }
            }
        });
        const sectionWithCount = {
            id: section.id,
            name: section.name,
            slug: section.slug,
            order_index: section.order_index,
            created_at: section.created_at,
            updated_at: section.updated_at,
            departments_count: section._count.departments
        };
        return res.json({
            message: 'Department section created successfully',
            section: sectionWithCount
        });
    }
    catch (error) {
        console.error('Admin department section create error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'A section with this name or slug already exists' });
        }
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
});
app.put('/api/admin/department-sections/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Section ID is required' });
        }
        const { name, slug, order_index } = req.body;
        const existingSection = await prisma.departmentSection.findUnique({
            where: { id }
        });
        if (!existingSection) {
            return res.status(404).json({ message: 'Department section not found' });
        }
        let finalSlug = slug;
        if (name && !slug) {
            finalSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (finalSlug && finalSlug !== existingSection.slug) {
            const slugConflict = await prisma.departmentSection.findUnique({
                where: { slug: finalSlug }
            });
            if (slugConflict) {
                return res.status(400).json({ message: 'A section with this slug already exists' });
            }
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (finalSlug !== undefined)
            updateData.slug = finalSlug;
        if (order_index !== undefined)
            updateData.order_index = order_index;
        const section = await prisma.departmentSection.update({
            where: { id },
            data: updateData,
            include: {
                _count: {
                    select: {
                        departments: true
                    }
                }
            }
        });
        const sectionWithCount = {
            id: section.id,
            name: section.name,
            slug: section.slug,
            order_index: section.order_index,
            created_at: section.created_at,
            updated_at: section.updated_at,
            departments_count: section._count.departments
        };
        return res.json({
            message: 'Department section updated successfully',
            section: sectionWithCount
        });
    }
    catch (error) {
        console.error('Admin department section update error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'A section with this name or slug already exists' });
        }
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
});
app.delete('/api/admin/department-sections/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Section ID is required' });
        }
        const existingSection = await prisma.departmentSection.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        departments: true
                    }
                }
            }
        });
        if (!existingSection) {
            return res.status(404).json({ message: 'Department section not found' });
        }
        if (existingSection._count.departments > 0) {
            return res.status(400).json({
                message: 'Cannot delete section with departments. Please remove or reassign departments first.'
            });
        }
        await prisma.departmentSection.delete({
            where: { id }
        });
        return res.json({
            message: 'Department section deleted successfully'
        });
    }
    catch (error) {
        console.error('Admin department section delete error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
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
});
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=server.js.map