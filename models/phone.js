'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phone extends Model {
    static associate (models) {
      // define association here
    }
  }
  Phone.init(
    {
      model: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      brand: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1970,
          max: new Date().getFullYear(),
        },
      },
      cpu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ram: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      screenSize: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0.1,
        },
      },
      nfc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Phone',
    }
  );
  return Phone;
};
