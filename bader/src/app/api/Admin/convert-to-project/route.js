// app/api/admin/convert-to-project/route.js
import connectDB from "@/lib/db";
import Issue from "@/models/Issue";
import Project from "@/models/Project";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Category from "@/models/Category";

export async function POST(req) {
  try {
    await connectDB();
    const { issueId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return NextResponse.json(
        { error: "معرف البلاغ غير صالح" },
        { status: 400 }
      );
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return NextResponse.json({ error: "البلاغ غير موجود" }, { status: 404 });
    }

    if (issue.status === "converted-to-project") {
      return NextResponse.json(
        { error: "تم تحويل البلاغ سابقًا إلى مشروع" },
        { status: 400 }
      );
    }

    let categoryId = issue.category;

    // إذا لم يكن هناك تصنيف، نحاول إيجاده بناءً على problemType
    if (!categoryId && issue.problemType) {
      console.log("البحث عن التصنيف بناءً على نوع المشكلة:", issue.problemType);
      let category = await Category.findOne({ name: issue.problemType });

      // إذا لم نجد تصنيفًا، نقوم بإنشاء واحد
      if (!category) {
        try {
          console.log("إنشاء تصنيف جديد لـ:", issue.problemType);
          category = await Category.create({
            name: issue.problemType,
          });
          console.log("تم إنشاء تصنيف جديد:", category._id);
        } catch (categoryError) {
          console.error("خطأ في إنشاء التصنيف:", categoryError);
        }
      }

      if (category) {
        categoryId = category._id;

        // تحديث البلاغ بالتصنيف الذي وجدناه
        issue.category = categoryId;
        await issue.save();

        console.log(
          "تم العثور على/إنشاء التصنيف وتحديث البلاغ:",
          category.name
        );
      } else {
        console.log("لم يتم العثور على تصنيف مطابق ولم نتمكن من إنشاء واحد");
      }
    }

    // إذا ما زلنا لا نملك معرف تصنيف، نحاول العثور على أي تصنيف موجود
    if (!categoryId) {
      try {
        const anyCategory = await Category.findOne();
        if (anyCategory) {
          categoryId = anyCategory._id;
          console.log("استخدام أول تصنيف وجدناه:", anyCategory.name);

          // تحديث البلاغ
          issue.category = categoryId;
          await issue.save();
        }
      } catch (err) {
        console.error("خطأ في البحث عن أي تصنيف:", err);
      }
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          error:
            "البلاغ لا يحتوي على تصنيف (category) ولم نستطع إيجاد أو إنشاء تصنيف",
        },
        { status: 400 }
      );
    }

    // تحضير الصور بطريقة آمنة
    let processedImages = [];
    if (Array.isArray(issue.images)) {
      console.log("معالجة الصور:", issue.images.length);
      processedImages = issue.images
        .map((img) => {
          if (typeof img === "object" && img.url) {
            return img.url;
          } else if (typeof img === "string") {
            return img;
          }
          return null;
        })
        .filter(Boolean); // استبعاد القيم الفارغة
    }
    console.log("الصور بعد المعالجة:", processedImages.length);

    try {
      const project = await Project.create({
        title: issue.problemType || "مشروع بدون اسم",
        description: issue.description || "لا يوجد وصف",
        location: issue.location || "",
        category: categoryId,
        images: processedImages,
        severity: issue.severityLevel || "medium",
        createdBy: issue.reportedBy || issue.createdBy || undefined,
        donationTarget: issue.donationTarget || 0,
        volunteerCount: issue.volunteerCount || 0,
        volunteerHours: issue.volunteerHours || 0,
        createdFromIssue: issue._id,
        status: "in-progress",
        locationLat: issue.locationLat || 0,
        locationLng: issue.locationLng || 0,
        locationName: issue.locationName || "", // نتيجة reverse geocoding
      });

      issue.status = "converted-to-project";
      issue.projectId = project._id;
      await issue.save();

      try {
        await Notification.create({
          title: ` تمت بدء العمل  عل  مشروع جديد:  "${project.title}".`,
          message: ` تمت بدء العمل  عل  مشروع جديد:  "${project.title}".`,
          type: "project",
          user: issue.reportedBy || issue.createdBy,
        });
      } catch (notificationError) {
        // تسجيل الخطأ ولكن متابعة العملية
        console.error("خطأ في إنشاء الإشعار:", notificationError);
      }

      return NextResponse.json({ success: true, projectId: project._id });
    } catch (projectError) {
      console.error("خطأ في إنشاء المشروع:", {
        error: projectError.message,
        details: projectError,
      });
      return NextResponse.json(
        { error: projectError.message || "فشل في إنشاء المشروع" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("❌ خطأ أثناء تحويل البلاغ إلى مشروع:", {
      message: err.message,
      stack: err.stack,
      errors: err.errors || null,
    });
    return NextResponse.json(
      { error: err.message || "حدث خطأ داخلي في السيرفر" },
      { status: 500 }
    );
  }
}
