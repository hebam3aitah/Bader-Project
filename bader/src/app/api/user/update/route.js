
import connectDB from '@/lib/db'; 
import User from '@/models/User';  // نموذج المستخدم
import multer from 'multer';  // لتخزين الصور
import path from 'path';

const upload = multer({
  dest: 'uploads/',  // تحديد المسار الذي سيتم تخزين الصور فيه
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

export const config = {
  api: {
    bodyParser: false,  // إيقاف تحليل الـ body الافتراضي في Next.js للسماح باستخدام multer
  },
};

export async function PUT(req, res) {
  try {
    await connectDB();

    // استخدام multer لتحميل الصور
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: 'حدث خطأ أثناء تحميل الصورة' });
      }

      const { name, email, phone, age, profession, otp } = req.body;

      // تأكد من أنه تم إرسال OTP إذا كانت الصورة قد تم تحميلها بنجاح
      if (otp && otp !== 'validOtp') {  // تحقق من OTP هنا
        return res.status(400).json({ success: false, message: 'OTP غير صالح' });
      }

      // تحديث بيانات المستخدم في قاعدة البيانات
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,  // هنا يجب أن تتأكد من أنك تستخرج الـ id من التوثيق (NextAuth أو JWT)
        {
          name,
          email,
          phone,
          age,
          profession,
          image: req.file ? req.file.path : undefined,  // إذا تم تحميل صورة، حفظ المسار
        },
        { new: true }
      );

      res.status(200).json({ success: true, user: updatedUser });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل التحديث' });
  }
}
