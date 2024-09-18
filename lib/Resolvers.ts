import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "5m" }
  );
};

const comparePassword = async (
  enteredPassword: string,
  storedPassword: string
) => {
  const isMatch = await bcrypt.compare(enteredPassword, storedPassword);
  if (!isMatch) {
    throw new Error("Invalid password");
  }
};

export const resolvers = {
  Upload: GraphQLUpload,
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
        console.error("Error while fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    files: async (_: any, __: any, { userId }: any) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      try {
        const user = await prisma.file.findMany({
          where: {
            userId: userId,
          },
        });
        return user;
      } catch (error) {
        console.error("Error while fetching user:", error);
        throw new Error("Failed to fetch user");
      }
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
        const employees = await prisma.accessControl.findMany();
        return employees;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch employees lists");
      }
    },
  },
  Mutation: {
    signUp: async (
      _: any,
      { username, email, password, confirmPassword }: any
    ) => {
      try {
        // Validate password match
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match, please check the password.");
        }

        // Check if the email already exists
        const existingUser = await prisma.users.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new Error("Email already exists, please use a different one.");
        }

        // Hash the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create new user
        const userData = await prisma.users.create({
          data: {
            username,
            email,
            password: hashedPwd,
          },
        });

        return userData;
      } catch (error: any) {
        // Log the actual error for debugging
        console.error("Error while creating user:", error.message);

        // Throw a more user-friendly message
        if (error.message.includes("Passwords do not match")) {
          throw new Error(error.message);
        } else if (error.message.includes("Email already exists")) {
          throw new Error(error.message);
        } else {
          throw new Error(
            "An error occurred while creating the user. Please try again later."
          );
        }
      }
    },
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        // Check in 'users' table (admin role)
        let user = await prisma.users.findUnique({ where: { email } });
        if (user) {
          // Check if the role is "admin"
          if (user.role !== "admin") {
            throw new Error(
              "Unauthorized: Only admin users are allowed to login here"
            );
          }

          // Compare the password
          await comparePassword(password, user.password);

          // Generate token and return user data
          const token = generateToken(user);
          return { ...user, token };
        }

        // If not found in 'users', check in 'accessControl' table (employee role)
        const employee = await prisma.accessControl.findUnique({
          where: { email },
        });
        if (employee) {
          // Check if the role is "employee"
          if (employee.role !== "employee") {
            throw new Error(
              "Unauthorized: Only employee users are allowed to login here"
            );
          }

          // Compare the password
          await comparePassword(password, employee.password);

          // Generate token and return employee data
          const token = generateToken(employee);
          return { ...employee, token };
        }

        // If neither admin nor employee is found, throw an error
        throw new Error("Invalid email or password");
      } catch (error: any) {
        console.error("Error logging in user:", error.message);
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
        // Prepare the updated data object by filtering out undefined values
        const updateData: any = {
          ...(username && { username }),
          ...(email && { email }),
          ...(company_name && { company_name }),
          ...(phone_number && { phone_number }),
          ...(address && { address }),
        };

        // Ensure there is data to update
        if (Object.keys(updateData).length === 0) {
          throw new Error("No valid fields to update");
        }

        // Update the user in the database
        const updatedUser = await prisma.users.update({
          where: { id },
          data: updateData,
        });

        return updatedUser;
      } catch (error: any) {
        console.error("Error updating user:", error.message || error);
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
      if (!email && !password) {
        throw new Error("All fields are mandatory");
      }

      // Check if the email already exists on users database
      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      // Check if the email already exists on access control database
      const existingAccessUser = await prisma.accessControl.findUnique({
        where: { email },
      });

      if (existingUser || existingAccessUser) {
        throw new Error("Email already exists, please use a different one");
      }

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
        console.error("Error while creating employee", error);
        throw new Error("Failed to create employee");
      }
    },
    createFile: async (
      _: any,
      { fileUrl, filename }: { fileUrl: string; filename: string },
      { userId }: any
    ) => {
      // const existingUser = await prisma.users.findUnique({
      //   where: { id: userId },
      // });

      // if (!existingUser) {
      //   throw new Error("user does not exist");
      // }

      if (!userId) {
        throw new Error("user does not exist");
      }

      // Find the latest version of the file with the same filename for the user
      const existingFile = await prisma.file.findMany({
        where: {
          userId: userId,
          filename: filename,
        },
        orderBy: {
          version: "desc",
        },
        take: 1, // We only need the latest version of this file
      });

      // Determine the new version number
      const newVersion =
        existingFile.length > 0 ? existingFile[0].version + 1 : 1;

      const createdFile = await prisma.file.create({
        data: {
          filename,
          fileUrl,
          version: newVersion,
          createdAt: new Date(),
          userId,
        },
      });
      return createdFile;
    },
    // uploadFile: async (_: any, { file }: any, { userId }: any) => {
    //   console.log({ file, userId });

    //   try {
    //     // const { createReadStream, filename } = await file;
    //     const { createReadStream, filename } = await file;
    //     const fileStream = createReadStream();

    //     // const chunks: Buffer[] = [];
    //     // for await (const chunk of fileStream) {
    //     //   chunks.push(chunk);
    //     // }
    //     // const fileBuffer = Buffer.concat(chunks);

    //     // Upload the file to S3
    //     const fileUrl = await uploadFileToS3(
    //       fileStream,
    //       filename,
    //       userId
    //       // mimetype
    //     );

    //     // Save the file metadata in PostgreSQL
    //     const savedFile = await prisma.file.create({
    //       data: {
    //         filename,
    //         fileUrl,
    //         userId,
    //       },
    //     });

    //     return savedFile;
    //   } catch (error) {
    //     console.error("Error uploading file:", error);
    //     throw new Error("File upload failed. Please try again.");
    //   }
    // },
  },
};
