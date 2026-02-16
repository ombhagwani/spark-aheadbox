import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Business from "@/models/Business";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { slug } = await params;
    
    const searchName = slug.replace(/-/g, ' ');

    const business = await Business.findOne({ 
      name: { $regex: new RegExp(`^${searchName}$`, 'i') } 
    });

    if (!business) {
      return NextResponse.json({ success: false, message: "Business not found" }, { status: 404 });
    }

    const isExpired = new Date(business.expiryDate) < new Date();

    if (!business.isActive || isExpired) {
      return NextResponse.json({ 
        success: true, 
        active: false, 
        message: "Plan has expired" 
      }, { status: 200 });
    }

    return NextResponse.json({ 
      success: true, 
      active: true, 
      data: {
        name: business.name,
        instaLink: business.instaLink,
        googleReviewLink: business.googleReviewLink,
        whatsappLink: business.whatsappLink,
        customLink: business.customLink,
        logoBase64: business.logoBase64,
        themeColor: business.themeColor
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}