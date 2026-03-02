
//use for define data types that use in KANBAN_BOARDS
export interface Board {
  _id: string;
  name: string;
  columns: Column[];
}

export interface Column {
  _id: string;
  name: string;
  order: number;
  jobApplications: JobApplication[];
}

export interface JobApplication  {
  _id: string;
  company: string;
  position: string;
  location?: string;
  status: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  order: number;
  columnId : string;
  tags?: string[];
  description?: string;
}