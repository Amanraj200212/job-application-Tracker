// use when ever user create it save thier data

import connectDB from "./db";
import { Board, Column } from "./model";
import jobApplication from "./model/job-application";

const DEFAULT_COLUMNS  = [
  { name: "Wish List",order: 0},
  { name: "Applied",order: 1},
  {name: "Interviewing",order: 2},
  {name: "Offer",order: 3},
  {name: "Rejected",order: 4}
]

export async function initialUserBoard(userId: string) {
  try {
    await connectDB();
    
    //check if board already exits or not
    //findOne() is from mongodb
    const existingBoard = await Board.findOne({userId, name: "Job Hunt"})

    if(existingBoard) {
      return existingBoard;
    }

    //Create the Board means creating database for storing all user choice like wishlist, rejected ..... 
    const board = await Board.create({
      name: "Job Hunt",
      userId,
      columns: [],
    });

    //Create default columns
    const columns = await Promise.all(DEFAULT_COLUMNS.map((col) => 
      Column.create({
        name: col.name,
        order: col.order,
        boardId: board._id,// mongodb use "_id" so ...
        jobApplication: [],
      })
    )
  );

  //Update the board with the new column IDs
  board.columns = columns.map((col) => col._id);

  await board.save();

  return board;

  } catch (err) {
    throw(err);
  }
}