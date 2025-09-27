import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, params: { params: { tags: string } }) {
  try {
    const { tags } = params.params;
    const tags_list = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];

    console.log("Tags received in agent route:", tags_list);

    let match_datasets;

    if (tags_list.length > 0) {
      // Find datasets that have at least one overlapping tag
      match_datasets = await prisma.dataset.findMany({
        where: {
          tags: {
            hasSome: tags_list,
          },
        },
        select: {
          id: true,
          owner:true,
          tags: true,
          description: true,
          size:true,
          price:true,
        },
      });
    } else {
      // No tags passed → return everything
      match_datasets = await prisma.dataset.findMany({
        select: {
          id: true,
          owner:true,
          tags: true,
          description: true,
          size:true,
          price:true,
        },
      });
    }
    match_datasets.map(ds=>{});
    return NextResponse.json(match_datasets);
  } catch (err) {
    console.error("Error in agent route:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
