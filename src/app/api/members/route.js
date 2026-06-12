import { auth } from "/src/app/api/auth/[...nextauth]/route";
import { connectDB } from '/src/lib/mongodb';
import { Member } from '/src/models/Member';

export async function GET(request) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const members = await Member.find({}).lean();

  return Response.json(members);
}

export async function POST(request) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  const user = await Member.findOne({ email: session.user.email });
  if (user?.role !== 'Admin') {
    return Response.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  const { email, role } = await request.json();

  await connectDB();

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

    return Response.json(
      {
        success: true,
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
