import { Column, JobApplication } from "@/lib/model/models.types"
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface jobApplicationCardProps{
  job: JobApplication;
  columns: Column[];
}

const JobApplicationCard = ({job, columns}: jobApplicationCardProps) => {
  return (
    <>
    <Card className="cursor-pointer transition-shadow hover: shadow-lg bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0" >
            <h3 className="font-semibold text-sm mb-1">
              {job.position.toUpperCase()}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              {job.company}
            </p>
            {job.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {job.description}
              </p>
            )}
            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {job.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-200 " 
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {job.jobUrl && (
              <a 
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1" 
                href={job.jobUrl} 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // prevent from parent clickable event
              >
                <ExternalLink />
              </a>
            )}
          </div>
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <MoreVertical className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit2 className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {columns.length > 1 && (
                  <>
                    {columns
                      .filter((col) => col._id !== job.columnId)
                      .map((column,key) => (
                        <DropdownMenuItem key={key}>
                          Move to {column.name}
                        </DropdownMenuItem>
                    ))}
                  </>
                )}

                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2"/>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
}

export default JobApplicationCard