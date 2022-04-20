'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('todo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      flag: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references:{
          model: 'user',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('todo');
  }
};