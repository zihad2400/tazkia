import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { notifyWelcome } from '@/lib/services/notificationService';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'নাম, ইমেইল এবং পাসওয়ার্ড প্রয়োজন' },
        { status: 400 }
      );
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ error: 'নাম কমপক্ষে ২ অক্ষরের হতে হবে' }, { status: 400 });
    }
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'সঠিক ইমেইল দিন' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }, { status: 400 });
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি একাউন্ট আছে' },
        { status: 409 }
      );
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      provider: 'credentials',
    });

    // ═══ Welcome Notification ═══
    try {
      await notifyWelcome(user._id.toString(), user.name);
    } catch (ne) {
      console.warn('Welcome notification failed:', ne.message);
    }

    return NextResponse.json(
      {
        message: 'একাউন্ট সফলভাবে তৈরি হয়েছে',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('🔴 Register error:', err);

    if (err.code === 11000) {
      return NextResponse.json({ error: 'এই ইমেইল ইতিমধ্যে ব্যবহৃত' }, { status: 409 });
    }
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { error: Object.values(err.errors).map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
