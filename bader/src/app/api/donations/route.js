
import { NextResponse } from "next/server";
import connectDB from '@/lib/db'; 
import Donation from "@/models/Donation";
import Project from "@/models/Project";
import Organization from "@/models/Organization";

export async function POST(req) {
  try {
    await connectDB();

    const { donorId, amount, isGeneral, projectId, organizationId, method } = await req.json();

    if (!donorId || !amount) {
      return NextResponse.json({ message: "البيانات ناقصة" }, { status: 400 });
    }

    const donation = await Donation.create({
      donor: donorId,
      amount,
      isGeneral,
      project: projectId || null,
      organization: organizationId || null,
      method: method || 'credit',
    });

    if (projectId) {
      const project = await Project.findById(projectId);
      if (project) {
        project.donations += amount;
        await project.save();
      }
    }

    if (organizationId) {
      const org = await Organization.findById(organizationId);
      if (org) {
        org.totalDonations += amount;
        await org.save();
      }
    }

    return NextResponse.json({ message: "تمت إضافة التبرع بنجاح", donation });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "فشل إضافة التبرع" }, { status: 500 });
  }
}
