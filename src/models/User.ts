import { DataTypes, HasManyCreateAssociationMixin, Model } from "sequelize";
import sequelize from "../database/db";
import { UserRoleEnum } from "../types/user";
import { Organization } from "./Organization";
import { OrganizationUser } from "./OrganizationUser";
import { Session } from "./Session";

export class User extends Model {
  public email!: string;
  public fiscalCode!: string; // PK
  public firstName!: string;
  public familyName!: string;
  public phoneNumber!: string | null;
  public role!: UserRoleEnum;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // An array of session associated to the user,
  // its value will be populated only when explicitly requested in code
  // according to the inclusion of the relation.
  // @see: https://sequelize.org/master/manual/typescript.html#usage
  public readonly sessions?: ReadonlyArray<Session>;

  // A single session associated to the user,
  // its value will be populated only when explicitly requested in code
  // according to the inclusion of the relation.
  // @see: https://sequelize.org/master/manual/typescript.html#usage
  public readonly session?: Session;

  public createSession!: HasManyCreateAssociationMixin<Session>;
}

export function init(): void {
  User.init(
    {
      email: {
        allowNull: false,
        primaryKey: true,
        type: new DataTypes.STRING()
      },
      familyName: {
        allowNull: false,
        type: new DataTypes.STRING()
      },
      firstName: {
        allowNull: false,
        type: new DataTypes.STRING()
      },
      fiscalCode: {
        allowNull: false,
        type: new DataTypes.STRING()
      },
      phoneNumber: {
        allowNull: true,
        type: new DataTypes.STRING()
      },
      role: {
        allowNull: false,
        type: new DataTypes.ENUM(...Object.values(UserRoleEnum))
      }
    },
    {
      modelName: "User",
      paranoid: true,
      sequelize,
      tableName: "Users",
      timestamps: true
    }
  );
}

export function createAssociations(): void {
  User.belongsToMany(Organization, {
    foreignKey: { name: "email", field: "userEmail" },
    otherKey: { name: "ipaCode", field: "organizationIpaCode" },
    through: OrganizationUser
  });
  User.hasMany(Session, {
    as: "sessions",
    foreignKey: { name: "email", field: "userEmail" }
  });
  User.hasOne(Session, {
    as: "session",
    foreignKey: { name: "email", field: "userEmail" }
  });
}
