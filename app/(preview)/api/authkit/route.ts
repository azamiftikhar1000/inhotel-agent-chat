import { NextRequest, NextResponse } from "next/server";
import { AuthKitToken } from "@picahq/authkit-node";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const authKitToken = new AuthKitToken("sk_test_1_3pejYG_SdSxV9xkt5_GA8WoMsSnfBHvY1qpGhlX-6DKd9kyZO3ee9hWfjGWpt5dY0AzxvM51q6_45_Q6bJTWCTuax7yq4X96nhvB0uTwhhLlsxyJm02JqasmdeDVeHt08GxGPoiBc7I9u00-1EKOejw62kNO0M1EaEFqwaGXw1Y8IfFH",
    {
      baseUrl: "https://platform-backend.inhotel.io/internal",
    }
  );
  const token = await authKitToken.create({
    identity: "65648fa26b1eb500122c5323", // a meaningful identifier (i.e., userId, teamId or organizationId)
    identityType: "user" // can be either user, team or organization
  });

  // Add CORS headers to the response
  return NextResponse.json(token, {
    headers: corsHeaders,
  });
}
