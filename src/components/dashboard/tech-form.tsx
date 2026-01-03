"use client";

import { createTech } from "@/actions/tech";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef } from "react";

export function TechForm() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Add Tech Stack</h3>
      <form
        ref={ref}
        action={async (formData) => {
          await createTech(formData);
          ref.current?.reset();
        }}
        className="space-y-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Tech Name</Label>
          <Input id="name" name="name" required placeholder="e.g. Next.js" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Language">Language</SelectItem>
              <SelectItem value="Framework">Framework</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="Tools">Tools</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="iconName">Icon Name (Lucide/SimpleIcons)</Label>
          <Input id="iconName" name="iconName" placeholder="e.g. React" />
        </div>

        <Button type="submit" className="w-full">Save Tech</Button>
      </form>
    </div>
  );
}