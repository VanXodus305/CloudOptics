import { auth } from "../../../app/api/auth/[...nextauth]/route";
import { connectDB } from "../../../lib/mongodb";
import { Member } from "../../../models/Member";
import { sendInvitationEmail } from "../../../lib/emailService";

export async function GET(request) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  const currentUser = await Member.findOne({ email: session.user.email });
  if (currentUser?.role !== 'Admin') {
    return Response.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  let query = {};
  if (search) {
    query = {
      $or: [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    };
  }

  const members = await Member.find(query).lean();

  return Response.json(members);
}

export async function POST(request) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  // Check if user is admin
  const user = await Member.findOne({ email: session.user.email });
  if (user?.role !== 'Admin') {
    return Response.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  const { email, role } = await request.json();

  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return Response.json(
        { error: 'Member already exists' },
        { status: 400 }
      );
    }

    const newMember = new Member({
      email,
      name: email.split('@')[0],
      role: role || 'Viewer',
      addedBy: user._id,
    });

    await newMember.save();

    // Send invitation email via Brevo
    let emailResult = { simulated: true };
    try {
      emailResult = await sendInvitationEmail({ to: email, role: newMember.role });
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // We don't fail the request if email sending fails, but we can flag it
    }

    return Response.json(
      {
        success: true,
        emailSent: !!emailResult,
        simulated: !!emailResult.simulated,
        invited: {
          email: newMember.email,
          role: newMember.role,
          addedBy: newMember.addedBy,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inviting member:', error);
    return Response.json(
      { error: 'Failed to invite member' },
      { status: 500 }
    );
  }
}

