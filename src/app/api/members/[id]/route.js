import { auth } from "../../../../app/api/auth/[...nextauth]/route";
import { connectDB } from "../../../../lib/mongodb";
import { Member } from "../../../../models/Member";
import { Types } from "mongoose";

export async function DELETE(request, { params }) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const user = await Member.findOne({ email: session.user.email });
  if (user?.role !== "Admin") {
    return Response.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 },
    );
  }

  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid member ID" }, { status: 400 });
  }

  await connectDB();

  try {
    const result = await Member.findByIdAndDelete(id);

    if (!result) {
      return Response.json({ error: "Member not found" }, { status: 404 });
    }

    return Response.json(
      {
        success: true,
        message: `Access permanently revoked for user ${id}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting member:", error);
    return Response.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
