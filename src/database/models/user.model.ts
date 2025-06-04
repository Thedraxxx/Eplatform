import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,

} from "sequelize-typescript";
import bcrypt from "bcrypt"

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM("student", "teacher", "institute", "super-admin"),
    defaultValue: "student",
  })
  declare role: string;

@BeforeCreate  //yo hooks lai chi User.create() la check garxa 
@BeforeUpdate  
 
static async hashPassword(user: User) {   //xa vana yo function call garxa

    if(user.changed("password")){   // pasword feild ma kahi changes aayo vana user.password lai update garxa simple
         const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password,salt)
    }
 }

}

//decorators use garara hamla password hash garnu parxa tara uta mongodb ma chi .pre vanna puction use garnu parthyo




export default User;
