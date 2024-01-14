import { NextRequest, NextResponse } from "next/server";
const fs = require("fs");

export type Model = {
  name: string;
  description: string;
  features: string[];
  target: string;
  pipeline_id: string;
};

async function handle(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }
  const reqBody: Model = await req.json();
  modelList.push(reqBody);
  fs.writeFile("data/models.json", JSON.stringify(modelList), () => {});
  console.log("🚀🚀", modelList);

  return NextResponse.json({
    msg: "added",
  });
}

export const GET = handle;
export const POST = handle;
export const modelList: Model[] = [];
