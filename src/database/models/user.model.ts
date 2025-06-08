import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  AllowNull,
  Length,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import ApiError from "../../utils/APIerror";
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
  @AllowNull(false)
  @Length({ min: 3, max: 15, msg: "username must be between the 3 and 15" })
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare username: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
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

  @BeforeCreate //yo hooks lai chi User.create() la check garxa
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
  //registration
  static async register(data: {
    username: string;
    email: string;
    password: string;
  }) {
    interface UserInput {
      username: string;
      email: string;
      password: string;
    }
    // console.log(req)
    // console.log(req.body);
    const { username, email, password }: UserInput = data; //roles kina lidinum vands= BOLA attack bata bachna
    /* clean banauxa code lai (username = req.body.username) yesto 
    multiple times garnu bhanda samlai destructure garara rakdda ramro hunxa
    2) yesla undefined lidaina so always define value matra halney
    */

    if (!username || !email || !password) {
      throw new ApiError(400, "Enter a valid input");
    }
    try {
      const existingUser = await User.findOne({ where: { email } }); // yesla already db ma yo email xa ki xaina vanara return ma boolean value pathauxa

      if (existingUser) {
        throw new ApiError(409, "User already exist"); //409 chi dublicate user ko lagi use hunxa
      }

      const user = await User.create({
        // register xaina vana naya table banauxa Usser model use garara ra given data lai save garxa
        username,
        email,
        password,
      });
      const userData = user.get({ plain: true }); // given data lai obj anusar lakhnu like { usernaem: "hari"}
      const { password: _, ...safeUserData } = userData; //destructuring ho jsla chi password lai chi remove gardinca user lai show garnu vanda agadi
      return safeUserData;
    } catch (error) {
      if (error instanceof ApiError) {
        //yo garena vana registraion faild dekhauxa email exist xa vana ni .. line 82 call hunna...
        throw error;
      }
      throw new ApiError(400, "registration failed");
    }
  }

  static async logIn(data: { email: string; password: string }) {
    const { email, password } = data;
    if (!email || !password) {
      throw new ApiError(400, "Plase enter a valid input");
    }
    const existingUser = await User.findOne({ where: { email } });
    // console.log(existingUser,"yooo wassap")

    //findAll la array return garxa hai
    if (!existingUser) {
      throw new ApiError(404, "Thsi email is not found !");
    }
    const isMatched = await bcrypt.compare(password, existingUser.password); // findALL -> existingUser[0].password
    if (!isMatched) {
      throw new ApiError(401, "credential Invalid ");
    }
    const userDataa = existingUser.get({ plain: true });
    const { password: _, ...safeUserData } = userDataa;
    return safeUserData;
  }
}

//decorators use garara hamla password hash garnu parxa tara uta mongodb ma chi .pre vanna puction use garnu parthyo

export default User;
