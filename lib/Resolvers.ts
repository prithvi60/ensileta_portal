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
    user: async (_: any, __: any, { userId }: any) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      try {
        const user = await prisma.users.findUnique({
          where: { id: userId },
        });
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    userProfile: async (
      _parent: any,
      _args: any,
      _context: any,
      _info: GraphQLResolveInfo
    ) => {
      const userId = _context.userId;
      // console.log(userId);

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
    getAllAccessControlUsers: async (_: any, args: { orderBy?: any }) => {
      try {
        const employees = await prisma.accessControl.findMany({
          orderBy: args.orderBy || {},
        });
        return employees;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to employees lists");
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
        // First, check if the user exists in the 'users' table (role: "admin")
        let user = await prisma.users.findUnique({ where: { email } });

        if (user) {
          if (user.role !== "admin") {
            throw new Error(
              "Unauthorized: Only admin users are allowed to login here"
            );
          }

          // Compare password with the one in 'users' (admin)
          const pwdMatch = await bcrypt.compare(password, user.password);
          if (!pwdMatch) {
            throw new Error("Invalid password");
          }

          // Generate JWT for admin user
          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "5m" }
          );

          return {
            ...user,
            token,
          };
        }

        // If the user is not found in 'users', check in 'accessControl' (role: "employee")
        const employee = await prisma.accessControl.findUnique({
          where: { email },
        });

        if (employee) {
          if (employee.role !== "employee") {
            throw new Error(
              "Unauthorized: Only employee users are allowed to login here"
            );
          }

          // Compare password with the one in 'accessControl' (employee)
          const pwdMatch = await bcrypt.compare(password, employee.password);
          if (!pwdMatch) {
            throw new Error("Invalid password");
          }

          // Generate JWT for employee user
          const token = jwt.sign(
            { id: employee.id, email: employee.email, role: employee.role },
            JWT_SECRET,
            { expiresIn: "5m" }
          );

          return {
            ...employee,
            token,
          };
        }

        // If no user is found, throw an error
        throw new Error("Invalid email or password");
      } catch (error) {
        console.error("Error logging in user:", error);
        throw new Error("Failed to log in");
      }
    },
    updateUser: async (
      _: any,
      { id, username, email, company_name, phone_number, address }: any,
      { userId }: any
    ) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }

      try {
        const updatedUser = await prisma.users.update({
          where: { id },
          data: {
            username,
            email,
            company_name,
            phone_number,
            address,
          },
        });
        return updatedUser;
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
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
    uploadAccessControlUsers: async (_: any, { email, password }: any) => {
      const hashedPwd = await bcrypt.hash(password, 10);
      try {
        const employeeData = await prisma.accessControl.create({
          data: {
            email,
            password: hashedPwd,
          },
        });

        return employeeData;
      } catch (error) {
        console.error("Error creating employee:", error);
        throw new Error("Failed to create employee");
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

// login: async (
//   _: any,
//   { email, password }: { email: string; password: string }
// ) => {
//   try {
//     const user = await prisma.users.findUnique({ where: { email } });

//     if (!user) {
//       throw new Error("Invalid Email");
//     }

//     const pwd = await bcrypt.compare(password, user.password);

//     if (!pwd) {
//       throw new Error("Invalid password");
//     }

//     const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
//       expiresIn: "5m",
//     });

//     // return token;
//     return {
//       ...user,
//       token,
//     };
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     throw new Error("Failed to log in");
//   }
// },
