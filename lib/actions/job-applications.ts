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

//for update job card

export async function updateJobApplication(
  id:string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId?: string;
    order?:number;
    tags?: string[];
    description?: string;
  }
) {
  const session = await getSession();
  if(!session?.user){
    return {error: "unAuthorized"};
  }

  const jobApplication = await JobApplication.findById(id);
  if(!jobApplication){
    return {error: "Job Application not found"};
  }

  if(jobApplication.userId !== session.user.id) {
    return {error: "unAuthorized"};
  }

  const {columnId, order, ...otherUpdates} = updates;

  const updatesToApply: Partial<{
    company: string;
    position: string;
    location: string;
    notes: string;
    salary: string;
    jobUrl: string;
    columnId: string;
    order:number;
    tags: string[];
    description: string;
  }> = otherUpdates;

  const currentColumnId = jobApplication.columnId.toString();
  const newColumnId = columnId?.toString();

  //For checking that our job card moving or not
  const isMovingToDiffrentColumn = newColumnId && newColumnId !== currentColumnId;

  if(isMovingToDiffrentColumn){
    await Column.findByIdAndUpdate(currentColumnId,{
      // remove item from array or list by targeting thier id
      $pull: {jobApplications: id},
    });

    //get all job excluding which are we moving
    const jobsInTargetColumn = await JobApplication.find({
      columnId: newColumnId,
      //$ne(not equal) --> check _id in jobappl. is not equal to id
      _id: {$ne: id},
    }).sort({order: 1})
      .lean();

    let newOrderValue : number;


    if(order !==  undefined && order !== null) {
      newOrderValue = order * 100;

      const jobsThatNeedToShift = jobsInTargetColumn.slice(order);
      for(const job of jobsThatNeedToShift) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + 100}
        });
      }
    } else {
      if(jobsInTargetColumn.length > 0) {
        const lastJobOrder = jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
        newOrderValue = lastJobOrder + 100;
      } else {
        newOrderValue = 0;
      }
    }

    updatesToApply.columnId = newColumnId;
    updatesToApply.order = newOrderValue;

    await Column.findByIdAndUpdate(newColumnId, {
      $push: {jobApplications: id}
    });

  } else if(order !== undefined && order !==null) {
    const otherJobInColumn = await jobApplication.find({
      columnId: currentColumnId,
      _id: {$ne: id},
    })
      .sort({order: 1})
      .lean();

    const currentJobOrder = jobApplication.order || 0;
    const currentPositionIndex = otherJobInColumn.findIndex(
      (job) => job.order > currentJobOrder
    );
    const oldPositionIndex = currentPositionIndex === -1 ? otherJobInColumn.length : currentPositionIndex;

    const newOrderValue = order * 100;
    if(order < oldPositionIndex) {
      const jobToshiftDown = otherJobInColumn.slice(order, oldPositionIndex);

      for(const job of jobToshiftDown) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: {order: job.order + 100}
        });
      }
    } else if(order > oldPositionIndex){
      const jobToShiftUp = otherJobInColumn.slice(oldPositionIndex, order);

      for(const job of jobToShiftUp) {
        const newOrder = Math.max(0, jobApplication.order - 100);
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: {order: newOrder}
        });
      }
    }

    updatesToApply.order = newOrderValue;
  }

  // for actual update in our database
  const updatedData = await JobApplication.findByIdAndUpdate(id, updatesToApply, {
    returnDocument: "after",
  });

  revalidatePath("/dashboard"); //cached
  return {data: JSON.parse(JSON.stringify(updatedData))}
}

//for deleting job card

export async function deleteJobApplication(id: string){
  const session = await getSession();

  if(!session?.user){
    return {error: "unAuthorized"};
  }

  const jobApplication = await JobApplication.findById(id);
  if(!jobApplication) {
    return {error: "Job application not found"}
  }
  if(jobApplication.userId !== session.user.id) {
    return {error: "unAuthorized"}
  }

  //firstly delete from column
  await Column.findByIdAndUpdate(jobApplication.columnId, {
    $pull: {jobApplications: id},
  });

  await JobApplication.deleteOne({_id: id});
  revalidatePath("/dashboard");
  return{success: true}
}