const { sequelize, User, Category, Upload } = require('./models');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        console.log('Starting database seed...');

        // Sync database (recreate tables)
        await sequelize.sync({ force: true });
        console.log('✓ Database tables created');

        // Create admin user
        const admin = await User.create({
            username: 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@studyhub.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            fullName: 'Admin User',
            role: 'admin',
            bio: 'Platform Administrator'
        });
        console.log('✓ Admin user created');

        // Create sample users
        const users = await User.bulkCreate([
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: 'password123',
                fullName: 'John Doe',
                bio: 'Computer Science student'
            },
            {
                username: 'jane_smith',
                email: 'jane@example.com',
                password: 'password123',
                fullName: 'Jane Smith',
                bio: 'Mathematics enthusiast'
            },
            {
                username: 'mike_johnson',
                email: 'mike@example.com',
                password: 'password123',
                fullName: 'Mike Johnson',
                bio: 'Physics lover'
            }
        ]);
        console.log('✓ Sample users created');

        // Create categories
        const categories = await Category.bulkCreate([
            {
                name: 'Computer Science',
                description: 'Programming, algorithms, data structures',
                icon: '💻',
                color: '#3b82f6'
            },
            {
                name: 'Mathematics',
                description: 'Calculus, algebra, statistics',
                icon: '📐',
                color: '#8b5cf6'
            },
            {
                name: 'Physics',
                description: 'Mechanics, thermodynamics, electromagnetism',
                icon: '⚡',
                color: '#f59e0b'
            },
            {
                name: 'Chemistry',
                description: 'Organic, inorganic, physical chemistry',
                icon: '🧪',
                color: '#10b981'
            },
            {
                name: 'Biology',
                description: 'Genetics, ecology, anatomy',
                icon: '🧬',
                color: '#ec4899'
            },
            {
                name: 'English',
                description: 'Literature, grammar, writing',
                icon: '📚',
                color: '#6366f1'
            }
        ]);
        console.log('✓ Categories created');

        // Create sample uploads (metadata only - no actual files)
        const uploads = await Upload.bulkCreate([
            {
                title: 'Introduction to Data Structures',
                description: 'Comprehensive notes on arrays, linked lists, stacks, and queues',
                type: 'note',
                userId: users[0].id,
                categoryId: categories[0].id,
                fileName: 'data-structures.pdf',
                filePath: '/uploads/sample-1.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                tags: ['data-structures', 'algorithms', 'computer-science'],
                isApproved: true,
                downloads: 45,
                views: 120
            },
            {
                title: 'Calculus Assignment - Chapter 5',
                description: 'Practice problems on integration and differentiation',
                type: 'assignment',
                userId: users[1].id,
                categoryId: categories[1].id,
                fileName: 'calculus-assignment.pdf',
                filePath: '/uploads/sample-2.pdf',
                fileSize: 512000,
                fileType: 'application/pdf',
                tags: ['calculus', 'integration', 'differentiation'],
                isApproved: true,
                downloads: 32,
                views: 89
            },
            {
                title: 'Newton\'s Laws of Motion',
                description: 'Detailed explanation with examples and diagrams',
                type: 'note',
                userId: users[2].id,
                categoryId: categories[2].id,
                fileName: 'newtons-laws.pdf',
                filePath: '/uploads/sample-3.pdf',
                fileSize: 2048000,
                fileType: 'application/pdf',
                tags: ['physics', 'mechanics', 'newton'],
                isApproved: true,
                downloads: 67,
                views: 156
            },
            {
                title: 'Organic Chemistry Lab Report',
                description: 'Synthesis and analysis of aspirin',
                type: 'assignment',
                userId: users[0].id,
                categoryId: categories[3].id,
                fileName: 'chemistry-lab.docx',
                filePath: '/uploads/sample-4.docx',
                fileSize: 768000,
                fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                tags: ['chemistry', 'organic', 'lab-report'],
                isApproved: false, // Pending approval
                downloads: 0,
                views: 12
            },
            {
                title: 'Python Programming Basics',
                description: 'Introduction to Python syntax, variables, and control structures',
                type: 'resource',
                userId: admin.id,
                categoryId: categories[0].id,
                fileName: 'python-basics.pdf',
                filePath: '/uploads/sample-5.pdf',
                fileSize: 1536000,
                fileType: 'application/pdf',
                tags: ['python', 'programming', 'beginner'],
                isApproved: true,
                downloads: 98,
                views: 234
            }
        ]);
        console.log('✓ Sample uploads created');

        console.log('\n=================================');
        console.log('Database seeded successfully!');
        console.log('=================================');
        console.log('\nAdmin Credentials:');
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
        console.log('\nSample User Credentials:');
        console.log('Email: john@example.com | Password: password123');
        console.log('Email: jane@example.com | Password: password123');
        console.log('Email: mike@example.com | Password: password123');
        console.log('=================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedDatabase();
