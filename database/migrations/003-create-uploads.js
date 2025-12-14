'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Uploads', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            type: {
                type: Sequelize.ENUM('note', 'assignment', 'resource'),
                allowNull: false
            },
            fileName: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            filePath: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            fileSize: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            fileType: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            tags: {
                type: Sequelize.JSON,
                allowNull: true
            },
            downloads: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            views: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            isApproved: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Add indexes
        await queryInterface.addIndex('Uploads', ['type'], {
            name: 'idx_type'
        });
        await queryInterface.addIndex('Uploads', ['userId'], {
            name: 'idx_userId'
        });
        await queryInterface.addIndex('Uploads', ['categoryId'], {
            name: 'idx_categoryId'
        });
        await queryInterface.addIndex('Uploads', ['isApproved'], {
            name: 'idx_isApproved'
        });
        await queryInterface.addIndex('Uploads', ['isActive'], {
            name: 'idx_isActive'
        });
        await queryInterface.addIndex('Uploads', ['createdAt'], {
            name: 'idx_createdAt'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Uploads');
    }
};
