import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'কোনো ছবি পাঠানো হয়নি' }, { status: 400 });
    }

    // ✅ Size limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'ছবি সর্বোচ্চ ৫ MB হতে পারবে' }, { status: 400 });
    }

    // ✅ Type check
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'শুধু ছবি আপলোড করা যাবে' }, { status: 400 });
    }

    // Buffer-এ রূপান্তর
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Cloudinary-তে upload (stream দিয়ে)
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'tazkia/avatars',
          public_id: `user_${session.user.id}`,
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // ✅ MongoDB-তে image URL save
    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { image: uploadResult.secure_url },
      { new: true }
    ).select('name email image role');

    if (!updatedUser) {
      return NextResponse.json({ error: 'ইউজার পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'ছবি সফলভাবে আপডেট হয়েছে',
      image: updatedUser.image,
    });
  } catch (err) {
    console.error('🔴 Avatar upload error:', err);
    return NextResponse.json(
      { error: err.message || 'ছবি আপলোড ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}

// ✅ ছবি ডিলিট করার জন্য
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    await dbConnect();

    // Cloudinary থেকে ডিলিট
    try {
      await cloudinary.uploader.destroy(`tazkia/avatars/user_${session.user.id}`);
    } catch (e) {
      console.warn('Cloudinary delete warning:', e.message);
    }

    // DB থেকে image ফিল্ড খালি
    await User.findByIdAndUpdate(session.user.id, { image: '' });

    return NextResponse.json({ message: 'ছবি মুছে ফেলা হয়েছে' });
  } catch (err) {
    console.error('🔴 Avatar delete error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
