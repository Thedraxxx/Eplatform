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
import jwt from "jsonwebtoken";
import { envconfig } from "../../config/config";
import { StringValue } from "ms";
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
    validate: {
      isEmail: true,
    }
  })
  declare email: string;
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM("student", "teacher", "institute", "super-admin"),
    defaultValue: "student",
  })
  declare role: string;
  @Column({
    type: DataType.STRING,
  })
  declare refreshToken: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare currentInstituteNumber: string;

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

    console.log(data);
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
       console.error("main errror: ",error)
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

    const accessToken = existingUser.generateAccessToken();
    const refreshToken = existingUser.generateRefresToken();
    existingUser.refreshToken = refreshToken;
    await existingUser.save();
    const options = {
      httpOnly: true,
      secure: envconfig.node_env === "production" ? true : false,
      // sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    const userDataa = existingUser.get({ plain: true });
    const {
      password: mypassword,
      refreshToken: refToken,
      ...safeUserData
    } = userDataa;
    return {
      safeUserData,
      accessToken,
      refreshToken,
      options,
    };
  }
  static async logout(){
        
  }
  generateAccessToken = () => {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        role: this.role,
      },
      envconfig.accesstoken_secret as string,
      {
        expiresIn: envconfig.accessToken_expiry as StringValue,
      }
    );
  };
  generateRefresToken = () => {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        role: this.role,
      },
      envconfig.refreshToken_secret as string,
      {
        expiresIn: envconfig.refreshToken_expiry as StringValue,
      }
    );
  };
}

//decorators use garara hamla password hash garnu parxa tara uta mongodb ma chi .pre vanna puction use garnu parthyo

export default User;
