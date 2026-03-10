"use client"

import { useEffect, useState } from "react";
import { Board, Column } from "../model/models.types";

export function useBoard(intialBoard?: Board | null) {
  const[board, setBoard] = useState<Board | null> (intialBoard || null);
  const[columns, setColumns] = useState<Column[]> (intialBoard?.columns || []);
  const[error, setError] = useState<string | null> (null);

  useEffect(() => {
    if(intialBoard){
      setBoard(intialBoard)
      setColumns(intialBoard.columns || [])
    }
  },[intialBoard])

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number
  ) {
    
  }

  return {board,columns,error, moveJob}
}

