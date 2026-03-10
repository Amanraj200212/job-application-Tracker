"use client"

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-applications";

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

const INTIAL_FORM_DATA = {
  company: "",
  position: "",
  location: "",
  salary: "",
  jobUrl: "",
  tags: "",
  description: "",
  notes: "",
}

const CreateJobApplicationDialog = ({columnId, boardId} : CreateJobApplicationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(INTIAL_FORM_DATA);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const result = await createJobApplication({
        ...formData,
        columnId, 
        boardId,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      });

      if(!result.error) {
        setFormData(INTIAL_FORM_DATA);
        setIsOpen(false);
      } else {
        console.error("Failed to create job: ", result.error)
      }
    } catch (err) {
      console.error(err);
    } 
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-4 justify-start text-muted-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
          <DialogDescription>Track a new job application</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input 
                  id="company" 
                  required 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input 
                  id="position" 
                  required 
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position:e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location </Label>
                <Input 
                  id="location"
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location:e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input 
                  id="salary" 
                  placeholder="e.g., $100k - $150k" 
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value })} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input 
                id="jobUrl" 
                placeholder="https://..."
                value={formData.jobUrl}
                onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (coma-seprated)</Label>
              <Input 
                id="tags" 
                placeholder="React, Tailwind, High Pay"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                rows={3}
                placeholder="Brief description about your role..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} type="button" variant="outline" >Cancel</Button>
            <Button type="submit">Add Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateJobApplicationDialog