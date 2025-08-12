const { DataTypes } = require("sequelize");
const { toDefaultValue } = require("sequelize/lib/utils");

module.exports = {
    up: async ({context : queryInterface}) => {
        await queryInterface.addColumn("users", "disabled", {
            type: DataTypes.BOOLEAN,
            DefaultValue : false
        })
    },
    down: async ({context:queryInterface}) => {
        await queryInterface.removeColumn("users","disabled")
    }
}
