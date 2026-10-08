import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { notifyProfileUpdated } from '@/lib/services/notificationService';

export const dynamic = 'force-dynamic';

// ═══ GET Profile ═══
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image || '',
        role: user.role,
        status: user.status,
        country: user.country || '',
        city: user.city || '',
        language: user.language || 'bn',
        timezone: user.timezone || 'Asia/Dhaka',
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
        provider: user.provider || 'credentials',
        hasPassword: !!user.password,
      },
    });
  } catch (err) {
    console.error('Profile GET error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}

// ═══ PUT Update Profile ═══
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, country, city, language, timezone } = body;

    await dbConnect();

    const updates = {};
    if (name && typeof name === 'string') updates.name = name.trim();
    if (country !== undefined) updates.country = country;
    if (city !== undefined) updates.city = city;
    if (language && ['bn', 'en', 'ar'].includes(language)) updates.language = language;
    if (timezone && typeof timezone === 'string') updates.timezone = timezone;

    const user = await User.findByIdAndUpdate(
      session.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ═══ Trigger notification ═══
    try { await notifyProfileUpdated(session.user.id); } catch (e) {}

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image || '',
        role: user.role,
        country: user.country || '',
        city: user.city || '',
        language: user.language || 'bn',
        timezone: user.timezone || 'Asia/Dhaka',
      },
    });
  } catch (err) {
    console.error('Profile PUT error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}
