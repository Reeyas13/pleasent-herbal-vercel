import { customError } from "../helpers/CustomError.js";
import prisma from "../prisma/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateToken,
  generateTokenForTwoStepsAuth,
  getTokenForTwoStepsAuth,
  getTokenInfo,
} from "../helpers/TokenHandler.js";
import { sendVerificationCode } from "./testMail.js";
export default {
  get: async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          addresses: true,
        },
      });
      if (users.length < 1) {
        return res.status(404).json({ message: "No user found" });
      }
      return res.json(users);
    } catch (error) {
      return customError(500, error.message);
    }
  },
  post: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      // console.log({name, email, password})
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const doesUserExist = await prisma.user.findMany({
        where: { email },
      });
      if (!(doesUserExist.length < 1)) {
        return res.json({ message: "User already exists", sucess: false });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          role: "ADMIN",
          phone: "12",
          password: hashedPassword,
        },
      });

      if (!user) {
        return customError(500, "Something went wrong");
      }
      //

      /**
       * +
       */
      // const token = generateToken(user.name, user.email, user.role,user.id);
      // res.token = token;
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      // });
      res
        .status(200)
        .json({ message: "User created successfully", sucess: true });
    } catch (error) {
      return res.json({ error: error.message, sucess: false });
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Check if both email and password are provided
      if (!email || !password) {
        return res.json({
          message: "Email and password are required",
          sucess: false,
        });
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // If user does not exist, return unauthorized error
      if (!user) {
        return res.json({
          message: "Invalid email or password",
          sucess: false,
        });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.json({
          message: "Invalid email or password",
          sucess: false,
        });
      }
      if (user.locked) {
        const now = new Date();
        const lockedAt = new Date(user.lockedAt);
        const hoursSinceLock = (now - lockedAt) / (1000 * 60 * 60);
        if (hoursSinceLock >= 5) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              locked: false,
              lockedAt: null,
              Attempt: 0,
            },
          });
        } else {
          return res.json({
            message: "Account is locked try again later , or contact support",
            sucess: false,
          });
        }
      }

      // Generate JWT token
      // const token = generateToken(user.name, user.email, user.role,user.id);
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      const updated = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: false,
          VerificationCode: verificationCode,
        },
      });
      await sendVerificationCode(verificationCode, user.email);
      const twoStepToken = generateTokenForTwoStepsAuth(user.email, updated.id);
      // Set token in cookie
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      // });
      res.cookie("twoStepToken", twoStepToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      // Return success response
      return res
        .status(200)
        .json({
          message: "check email and enter the code to login",
          success: true,
          twoStepToken,
        });
    } catch (error) {
      return res.json({ message: error.message,success:false });
    }
  },
  test: async (req, res, next) => {
    try {
      const token = req.cookies.token;
      const VerificationCode = req.cookies.VerificationCode;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log({ token });
      const decoded = await getTokenInfo(token);
      return res.json({ decoded });
    } catch (error) {
      return customError(500, error.message);
    }
  },
  twoStepToken: async (req, res, next) => {
    try {
      const twoStepToken = req.cookies.twoStepToken;

      const { verificationCode } = req.body;
      if (!twoStepToken) {
        return res.json({ message: "Unauthorized", success: false });
      }
     
      const decoded = getTokenForTwoStepsAuth(twoStepToken);
      const user = await prisma.user.findFirst({
        where: {
          // email:decoded.email,
          id: decoded.userId,
        },
      });

      if (!user) {
        return res.json({
          message: "Unauthorized something went wrong",
          success: false,
        });
      }
      // console.log({ code: user.VerificationCode , verificationCod/e:verificationCode});
      // console.log(verificationCode === user.VerificationCode);
      if (user.VerificationCode !== verificationCode) {
        const Attempt = user.Attempt + 1;
        console.log({ Attempt });
        if (Attempt >= 5) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              locked: true,
              lockedAt: new Date(),
              Attempt: Attempt,
            },
          });
          return res.json({
            message: "Account is locked try again in 5hrs, or contact support",
            success: false,
          });
        } else {
          console.log("else block");
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              Attempt: Attempt,
            },
          });
          return res.json({
            message: "Invalid verification code atempt left :" + 5 - Attempt,
            success: false,
          });
        }
      }
      //  success

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          locked: false,
          isVerified: true,
          VerificationCode: null,
          Attempt: 0,
        },
      });

      const token = generateToken(user.name, user.email, user.role, user.id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.clearCookie("twoStepToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      // console.log(user)
      // user.password=undefined
      return res.json({ message: "Login success", success: true,user:{
        name:user.name,
        email:user.email,
        role:user.role,
        userId:user.id
      } });
    } catch (error) {
      return res.json({ message: error.message });
    }
  },logout:async(req,res)=>{
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.clearCookie("twoStepToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.json({ message: "Logout success", success: true });
    } catch (error) {
      return res.json({ message: error.message,success:false });
    }
  },
  getMyInfo:async(req,res)=>{
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const {userId} = await getTokenInfo(token);
      const user  = await prisma.user.findFirst({
        where: {
          id: parseInt(userId),
        },
        include:{
          addresses:true,
          orders:true,

        }
      })
      user.password = undefined;
      return res.json({ user,success:true });
    } catch (error) {
      return res.json({ message: error.message });
    }
  },
};
