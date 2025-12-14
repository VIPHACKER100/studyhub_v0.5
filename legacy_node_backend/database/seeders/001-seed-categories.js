'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const categories = [
            {
                name: 'Computer Science',
                description: 'Programming, algorithms, data structures',
                icon: '💻',
                color: '#3B82F6',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Mathematics',
                description: 'Calculus, algebra, statistics',
                icon: '📐',
                color: '#8B5CF6',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Physics',
                description: 'Mechanics, thermodynamics, electromagnetism',
                icon: '⚛️',
                color: '#10B981',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Chemistry',
                description: 'Organic, inorganic, physical chemistry',
                icon: '🧪',
                color: '#F59E0B',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Biology',
                description: 'Genetics, ecology, microbiology',
                icon: '🧬',
                color: '#EC4899',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Engineering',
                description: 'Mechanical, electrical, civil engineering',
                icon: '⚙️',
                color: '#6366F1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Business',
                description: 'Management, finance, marketing',
                icon: '💼',
                color: '#14B8A6',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Literature',
                description: 'English, creative writing, linguistics',
                icon: '📚',
                color: '#F97316',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'History',
                description: 'World history, ancient civilizations',
                icon: '🏛️',
                color: '#84CC16',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'General',
                description: 'Miscellaneous topics',
                icon: '📝',
                color: '#6B7280',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('Categories', categories, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Categories', null, {});
    }
};
