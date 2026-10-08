import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    image: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'author', 'editor', 'moderator', 'admin', 'super_admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
    },
    emailVerified: { type: Date, default: null },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Dhaka' },
    preferences: {
      theme: { type: String, default: 'system' },
      quranFont: { type: String, default: 'Noto Naskh Arabic' },
      quranFontSize: { type: Number, default: 28 },
      translationFontSize: { type: Number, default: 16 },
      lineHeight: { type: Number, default: 2.4 },
      prayerNotifications: { type: Boolean, default: true },
      quranNotifications: { type: Boolean, default: true },
      hadithNotifications: { type: Boolean, default: false },
      emailNewsletter: { type: Boolean, default: false },
      soundEnabled: { type: Boolean, default: true },
      vibrationEnabled: { type: Boolean, default: true },
      autoPlayEnabled: { type: Boolean, default: false },
      animationsEnabled: { type: Boolean, default: true },
    },
    lastActive: { type: Date, default: Date.now },
    provider: { type: String, default: 'credentials' },
  },
  { timestamps: true }
);

// ✅ Password hash — Mongoose 9 compatible
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ✅ Compare password
UserSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// ❌ REMOVED duplicate indexes — `unique: true` on email already creates one
// UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
