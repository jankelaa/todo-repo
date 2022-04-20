'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.changeColumn('user', 'email', {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.removeConstraint('user', 'user_email_key');
  }
};