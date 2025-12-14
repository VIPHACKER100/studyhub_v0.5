'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await queryInterface.bulkInsert('Users', [
            {
                username: 'admin',
                email: 'admin@studyhub.com',
                password: hashedPassword,
                fullName: 'System Administrator',
                role: 'admin',
                bio: 'Default system administrator account',
                avatar: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', {
            username: 'admin'
        }, {});
    }
};
