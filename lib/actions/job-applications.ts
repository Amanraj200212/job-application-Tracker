// this is server action files

"use server"
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../model";

interface JobApplicationData {
    company: string;
    position: string;
    location?: string;
    salary?: string;
    jobUrl?: string;
    tags?: string[];
    description?: string;
    notes?: string;
    columnId: string;
    boardId: string;
}

export async function createJobApplication( data: JobApplicationData) {
  const session = await getSession();

  if(!session?.user) {
    return {error: "Unauthorized"}
  }
  
  await connectDB();

  const{
    company,
    position,
    location,
    salary,
    jobUrl,
    tags,
    description,
    notes,
    columnId,
    boardId,
  } = data;

  if(!company || !position || !columnId || !boardId){
    return{ error: "Missing required Fields"}
  }

  //Verify board of owner
  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if(!board) {
    return {error: "Board not found"}
  }

  //Verify column belong to board to og owner
  const column = await Column.findOne({
    _id: columnId,
    boardId: boardId,
  });

  if(!column) {
    return {error: "Column not found"}
  }

 // find maxorder of order
  const maxOrder = (await JobApplication.findOne({columnId})
    .sort({order: -1}) // for descending order
    .select("order") // it only return order field
    .lean()) as {order: number} | null; // moongose return full moongose doc but we need only plain js object

  const jobApplication = await JobApplication.create({
    company,
    position,
    location,
    salary,
    jobUrl,
    tags: tags || [],
    description,
    notes,
    userId: session.user.id,
    columnId,
    boardId,
    status: "applied",
    order: maxOrder ? maxOrder.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push : {jobApplications: jobApplication._id},
  });
  
  revalidatePath("/dashboard"); //when ever new data add then also old cached data should also refresh

  //moongose return complex object data but we need JSOn Data
  return {data : JSON.parse(JSON.stringify(jobApplication))}
  
}