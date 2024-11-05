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
          include: {
            drawing2Dfiles: true,
            drawing3Dfiles: true,
            drawingBOQfiles: true,
          },
        });

        // console.log(user);

        return user;
      } catch (error) {
        console.error("Error while fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    users: async () => {
      try {
        const users = await prisma.users.findMany({
          include: {
            drawing2Dfiles: true,
            drawing3Dfiles: true,
            drawingBOQfiles: true,
          },
        });
        // console.log(users);

        return users;
      } catch (error) {
        console.error("Error while fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    getUser: async (_: any, { email }: { email: string }) => {
      console.log(email);
      const emailId = prisma.users.findUnique({ where: { email } });

      return emailId;
    },
    getAll2DFiles: async (_: any, __: any, { userId }: any) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      try {
        const user = await prisma.drawing_2D.findMany({
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
    getAll3DFiles: async (_: any, __: any, { userId }: any) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      try {
        const user = await prisma.drawing_3D.findMany({
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
    getAllBOQFiles: async (_: any, __: any, { userId }: any) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      try {
        const user = await prisma.drawing_BOQ.findMany({
          where: {
            userId: userId,
          },
        });
        // console.log(user);

        return user;
      } catch (error) {
        console.error("Error while fetching user:", error);
        throw new Error("Failed to fetch user");
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
    getEmployeeUser: async (_: any, __: any, { userId }: any) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }

      try {
        const user = await prisma.accessControl.findUnique({
          where: { id: userId },
        });

        // console.log("employee", user);

        return user;
      } catch (error) {
        console.error("Error while fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    kanbanCards: async (_: any, { userId }: { userId: number }) => {
      try {
        const cards = await prisma.kanban_Cards.findMany({
          where: { userId },
        });
        return cards;
      } catch (error) {
        console.error("Error fetching Kanban cards:", error);
        throw new Error("Unable to fetch Kanban cards");
      }
    },
    getMarkerGroupsByDrawing2D: async (
      _: any,
      { drawing2DId }: { drawing2DId: number }
    ) => {
      try {
        // @ts-ignore
        const data = await prisma.markerGroup.findMany({
          where: { drawing2DId },
          include: { markers: true, drawing2D: true },
        });
        return data;
      } catch (error) {
        console.error("Error fetching Markers Data:", error);
        throw new Error("Unable to fetch Markers Data");
      }
    },
    getMarkerGroupBy2DId: async (
      _: any,
      { drawing2DId }: { drawing2DId: number }
    ) => {
      try {
        // @ts-ignore
        const markerGroup = await prisma.markerGroup2D.findFirst({
          where: { drawing2DId },
        });

        return markerGroup;
      } catch (error) {
        console.error("Error fetching marker group:", error);
        throw new Error("Unable to fetch marker group.");
      }
    },
    getMarkerGroupBy3DId: async (
      _: any,
      { drawing3DId }: { drawing3DId: number }
    ) => {
      try {
        // @ts-ignore
        const markerGroup = await prisma.markerGroup3D.findFirst({
          where: { drawing3DId },
        });

        return markerGroup;
      } catch (error) {
        console.error("Error fetching marker group:", error);
        throw new Error("Unable to fetch marker group.");
      }
    },
    getMarkerGroupByBoqId: async (
      _: any,
      { drawingBoqId }: { drawingBoqId: number }
    ) => {
      console.log("id get boq", drawingBoqId);
      try {
        // @ts-ignore
        const markerGroup = await prisma.markerGroupBoq.findFirst({
          where: { drawingBoqId },
        });

        return markerGroup;
      } catch (error) {
        console.error("Error fetching marker group:", error);
        throw new Error("Unable to fetch marker group.");
      }
    },
  },
  Mutation: {
    signUp: async (
      _: any,
      {
        username,
        email,
        company_name,
        phone_number,
        address,
        department,
        password,
        confirmPassword,
      }: any
    ) => {
      console.log({
        username,
        email,
        company_name,
        password,
        confirmPassword,
        phone_number,
        address,
        department,
      });
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
            company_name,
            password: hashedPwd,
            role: "admin",
            phone_number,
            address,
            department,
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

        // // Send email notification to the user
        // await sendEmailNotification(
        //   "prithvi@webibee.com",
        //   "User Profile Submission Notification",
        //   "User Profile Submission Successful"
        // );

        return updatedUser;
      } catch (error: any) {
        console.error("Error updating user:", error.message || error);
        throw new Error("Failed to update user");
      }
    },
    uploadAccessControlUsers: async (
      _: any,
      { username, email, department, password }: any
    ) => {
      if (!username && !email && !password) {
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
            username,
            email,
            department,
            password: hashedPwd,
          },
        });

        return employeeData;
      } catch (error) {
        console.error("Error while creating employee", error);
        throw new Error("Failed to create employee");
      }
    },
    upload2DFile: async (
      _: any,
      {
        fileUrl,
        filename,
        userId,
      }: { fileUrl: string; filename: string; userId: number }
    ) => {
      // Find the latest version of the file with the same filename for the user
      const existingFile = await prisma.drawing_2D.findMany();

      // Determine the new version number
      const newVersion = existingFile.length;

      const createdFile = await prisma.drawing_2D.create({
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
    upload3DFile: async (
      _: any,
      {
        fileUrl,
        filename,
        userId,
      }: { fileUrl: string; filename: string; userId: number }
    ) => {
      // Find the latest version of the file with the same filename for the user
      const existingFile = await prisma.drawing_3D.findMany();

      // Determine the new version number
      const newVersion = existingFile.length;

      const createdFile = await prisma.drawing_3D.create({
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
    uploadBOQFile: async (
      _: any,
      {
        fileUrl,
        filename,
        userId,
      }: { fileUrl: string; filename: string; userId: number }
    ) => {
      // Find the latest version of the file with the same filename for the user
      const existingFile = await prisma.drawing_BOQ.findMany();

      // Determine the new version number
      const newVersion = existingFile.length;

      const createdFile = await prisma.drawing_BOQ.create({
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
    saveKanbanCard: async (_: any, { userId, card }: any) => {
      try {
        if (!userId) {
          throw new Error("Unauthorized");
        }

        // Construct the card data
        const cardData = {
          id: card.id || undefined,
          title: card.title,
          column: card.column,
          userId,
        };

        // Create the card in the database
        await prisma.kanban_Cards.create({
          data: cardData,
        });

        return true;
      } catch (error) {
        console.error("Error saving Kanban card:", error);
        return false;
      }
    },
    deleteKanbanCard: async (_: any, { id }: { id: number }) => {
      try {
        // Check if the card exists
        const card = await prisma.kanban_Cards.findUnique({
          where: { id },
        });

        if (!card) {
          return {
            success: false,
            message: "Card not found",
          };
        }

        // Delete the card
        await prisma.kanban_Cards.delete({
          where: { id },
        });

        return {
          success: true,
          message: "Card deleted successfully",
        };
      } catch (error) {
        console.error("Error deleting card:", error);
        return {
          success: false,
          message: "Failed to delete the card",
        };
      }
    },
    updateKanbanCard: async (_: any, { id, title, column }: any) => {
      try {
        const updatedCard = await prisma.kanban_Cards.update({
          where: { id },
          data: {
            title,
            column,
          },
        });
        return {
          success: true,
          message: "Card updated successfully",
          card: updatedCard,
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to update card",
          card: null,
        };
      }
    },
    addMarkerGroups: async (_: any, { drawing2DId, input }: any) => {
      console.log("backend", { drawing2DId, input });
      try {
        const markerGroups = [];

        for (const markersArray of input) {
          // @ts-ignore
          const markerGroup = await prisma.markerGroup.create({
            data: {
              drawing2DId,
              markers: {
                create: markersArray.map((marker: any) => ({
                  comment: marker.comment,
                  left: marker.left,
                  top: marker.top,
                  user: marker.user,
                  userId: marker.userId,
                })),
              },
            },
            include: { markers: true, drawing2D: true },
          });

          markerGroups.push(markerGroup);
        }
        // Return markerGroups only if populated
        if (markerGroups.length === 0) {
          throw new Error("No marker groups were created.");
        }
        return markerGroups;
      } catch (error) {
        console.error("Error in addMarkerGroups:", error);
        throw new Error("Failed to create marker groups");
      }
    },
    createMarkerGroup2D: async (_: any, { data, drawing2DId }: any) => {
      const jsonData = JSON.stringify(data);
      try {
        // @ts-ignore
        await prisma.markerGroup2D.deleteMany({
          where: { drawing2DId },
        });
        // @ts-ignore
        const newMarkerGroup = await prisma.markerGroup2D.create({
          data: {
            data: jsonData,
            drawing2DId,
          },
        });

        return newMarkerGroup;
      } catch (error) {
        console.error("Error creating marker group:", error);
        throw new Error("Failed to create marker group");
      }
    },
    createMarkerGroup3D: async (_: any, { data, drawing3DId }: any) => {
      const jsonData = JSON.stringify(data);
      try {
        // @ts-ignore
        await prisma.markerGroup3D.deleteMany({
          where: { drawing3DId },
        });
        // @ts-ignore
        const newMarkerGroup = await prisma.markerGroup3D.create({
          data: {
            data: jsonData,
            drawing3DId,
          },
        });

        return newMarkerGroup;
      } catch (error) {
        console.error("Error creating marker group:", error);
        throw new Error("Failed to create marker group");
      }
    },
    createMarkerGroupBOQ: async (_: any, { data, drawingBoqId }: any) => {
      const jsonData = JSON.stringify(data);
      try {
        // @ts-ignore
        await prisma.markerGroupBoq.deleteMany({
          where: { drawingBoqId },
        });
        // @ts-ignore
        const newMarkerGroup = await prisma.markerGroupBoq.create({
          data: {
            data: jsonData,
            drawingBoqId,
          },
        });

        return newMarkerGroup;
      } catch (error) {
        console.error("Error creating marker group:", error);
        throw new Error("Failed to create marker group");
      }
    },
  },
};
