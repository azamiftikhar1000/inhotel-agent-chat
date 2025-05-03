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
  const authKitToken = new AuthKitToken("sk_test_1_nwJXddHdNPifkP8vB9UwqsItzNBkjz4lwacmSTnpM7Ps4G4oOKRALgsyok8uQR3o7ZqvXIZD4NUFp6GTjfKlFo196rtPNhjTAFi7vdMstfgpUsKJ4PJU5hy8aMbbd_PPxKkW1R8ng_Ivg9Rf6UPm19rAsRFjVT6SOeQtEy_7JRvSlemof_j9iZTnAIlX4NwedO_tZ0w3rbCwxCjv7nrzDhcp5f8IAWDgGqiDMrVZMQ",
    {
      baseUrl: "https://platform-backend.inhotel.io/internal",
    }
  );
  const token = await authKitToken.create({
    // identity: "65648fa26b1eb500122c5323", // a meaningful identifier (i.e., userId, teamId or organizationId)
    // identityType: "user" // can be either user, team or organization
  });

  // Add CORS headers to the response
  return NextResponse.json(token, {
    headers: corsHeaders,
  });
}
