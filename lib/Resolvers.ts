import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLResolveInfo } from "graphql";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

export const resolvers = {
  Query: {
    users: async () => {
      const userData = await prisma.users.findMany();
      console.log(userData);
      return userData;
    },
    userProfile: async (
      _parent: any,
      _args: any,
      _context: any,
      _info: GraphQLResolveInfo
    ) => {
      const userId = _context.userId;
      console.log(userId);

      if (!userId) {
        throw new Error("Not authenticated");
      }
      // Fetch user data from the database
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }
      return {
        username: user.username,
        email: user.email,
        id: user.id,
      };
    },
    getAll2DFiles: async (_: any, args: { orderBy?: any }) => {
      try {
        const files = await prisma.view2D.findMany({
          orderBy: args.orderBy || {},
        });
        return files;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch files");
      }
    },
    getAll3DFiles: async (_: any, args: { orderBy?: any }) => {
      try {
        const files = await prisma.view3D.findMany({
          orderBy: args.orderBy || {},
        });
        return files;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch files");
      }
    },
    getAllBOQFiles: async (_: any, args: { orderBy?: any }) => {
      try {
        const files = await prisma.viewBOQ.findMany({
          orderBy: args.orderBy || {},
        });
        return files;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch files");
      }
    },
  },
  Mutation: {
    signUp: async (
      _: any,
      { username, email, password, confirmPassword }: any
    ) => {
      if (password !== confirmPassword) {
        throw new Error("Password do not match, Please check the password");
      }

      const hashedPwd = await bcrypt.hash(password, 10);
      try {
        const userData = await prisma.users.create({
          data: {
            username,
            email,
            password: hashedPwd,
          },
        });
        return userData;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
          throw new Error("Invalid Email");
        }

        const pwd = await bcrypt.compare(password, user.password);

        if (!pwd) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          { id: user.id.toString(), email: user.email },
          JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        console.log(token, user);

        // return token;
        return {
          ...user,
          token,
        };
      } catch (error) {
        console.error("Error logging in user:", error);
        throw new Error("Failed to log in");
      }
    },
    upload2DFile: async (_: any, { fileName }: any) => {
      if (!fileName) {
        throw new Error("Please Update your file name");
      }
      try {
        const existingFiles = await prisma.view2D.findMany({
          where: { fileName },
        });

        const newVersion = existingFiles.length + 1;

        const view2dFile = await prisma.view2D.create({
          data: {
            fileName,
            fileURL: "https://drive.google.com/drive/u/1/home",
            version: existingFiles.length > 0 ? newVersion : 1,
            createdAt: new Date().toISOString(),
          },
        });
        return view2dFile;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create name");
      }
    },
    upload3DFile: async (_: any, { fileName }: any) => {
      if (!fileName) {
        throw new Error("Please Update your file name");
      }
      try {
        const existingFiles = await prisma.view3D.findMany({
          where: { fileName },
        });

        const newVersion = existingFiles.length + 1;

        const view3dFile = await prisma.view3D.create({
          data: {
            fileName,
            fileURL: "https://drive.google.com/drive/u/1/home",
            version: existingFiles.length > 0 ? newVersion : 1,
            createdAt: new Date().toISOString(),
          },
        });
        return view3dFile;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create name");
      }
    },
    uploadBOQFile: async (_: any, { fileName }: any) => {
      if (!fileName) {
        throw new Error("Please Update your file name");
      }
      try {
        const existingFiles = await prisma.viewBOQ.findMany({
          where: { fileName },
        });

        const newVersion = existingFiles.length + 1;

        const viewBOQFile = await prisma.viewBOQ.create({
          data: {
            fileName,
            fileURL: "https://drive.google.com/drive/u/1/home",
            version: existingFiles.length > 0 ? newVersion : 1,
            createdAt: new Date().toISOString(),
          },
        });
        return viewBOQFile;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create name");
      }
    },
    // uploadPDF: async (_: any, { file }: any) => {
    //   try {
    //     const { createReadStream, filename } = await file;
    //     const filePath = `./uploads/${filename}`;

    //     const stream = createReadStream();
    //     const out = fs.createWriteStream(filePath);
    //     stream.pipe(out);

    //     await new Promise((resolve) => out.on("finish", resolve));

    //     // Upload to Google Drive and store metadata
    //     const newFile = await uploadFileAndStoreMetadata(filePath, filename);

    //     return newFile;
    //   } catch (error) {
    //     console.error("Error in uploadFile resolver:", error);
    //     throw new ApolloError({ errorMessage: "Error uploading the file" });
    //   }
    // },
  },
};
