import { PencilLine, Save, Trash2, UserRound } from "lucide-react";

import {
  createExperience,
  deleteExperience,
  getProfileForAdmin,
  updateExperience,
  upsertProfile,
} from "@/actions/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function toDateInputValue(dateValue: Date | null) {
  if (!dateValue) return "";

  const year = dateValue.getUTCFullYear();
  const month = String(dateValue.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function ProfileDashboardPage() {
  const data = await getProfileForAdmin();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Manager</h1>
        <p className="text-muted-foreground">Manage About profile and experience timeline.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Profile Details</h2>
          </div>

          <form action={upsertProfile} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" defaultValue={data.profile?.fullName ?? ""} placeholder="Your full name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                name="headline"
                defaultValue={data.profile?.headline ?? ""}
                placeholder="Example: Fullstack Developer"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={data.profile?.location ?? ""} placeholder="City, Country" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                defaultValue={data.profile?.avatarUrl ?? ""}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cvUrl">CV URL</Label>
              <Input id="cvUrl" name="cvUrl" defaultValue={data.profile?.cvUrl ?? ""} placeholder="https://..." />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={data.profile?.bio ?? ""}
                placeholder="Write short professional bio"
                className="min-h-36"
                required
              />
            </div>

            <Button type="submit" className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Add Experience</h2>

            <form action={createExperience} className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" placeholder="Company name" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" placeholder="Role title" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input id="sortOrder" name="sortOrder" type="number" placeholder="0" />
              </div>

              <div className="flex items-end gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                <input id="isCurrent" name="isCurrent" type="checkbox" className="h-4 w-4 accent-primary" />
                <Label htmlFor="isCurrent" className="text-sm">
                  Current position
                </Label>
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe responsibilities and impact" />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" className="w-full gap-2">
                  <PencilLine className="h-4 w-4" />
                  Add Experience
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Experience Timeline</h3>

            {data.experiences.length === 0 ? (
              <p className="rounded-xl border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                No experience data yet.
              </p>
            ) : (
              data.experiences.map((item) => (
                <div key={item.id} className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{item.role}</h4>
                      {item.isCurrent && <Badge>Current</Badge>}
                    </div>

                    <form action={deleteExperience.bind(null, item.id)}>
                      <Button type="submit" variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>

                  <form action={updateExperience.bind(null, item.id)} className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor={`company-${item.id}`}>Company</Label>
                      <Input id={`company-${item.id}`} name="company" defaultValue={item.company} required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`role-${item.id}`}>Role</Label>
                      <Input id={`role-${item.id}`} name="role" defaultValue={item.role} required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`startDate-${item.id}`}>Start Date</Label>
                      <Input
                        id={`startDate-${item.id}`}
                        name="startDate"
                        type="date"
                        defaultValue={toDateInputValue(item.startDate)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`endDate-${item.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${item.id}`}
                        name="endDate"
                        type="date"
                        defaultValue={toDateInputValue(item.endDate)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`sortOrder-${item.id}`}>Sort Order</Label>
                      <Input id={`sortOrder-${item.id}`} name="sortOrder" type="number" defaultValue={item.sortOrder} />
                    </div>

                    <div className="flex items-end gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                      <input
                        id={`isCurrent-${item.id}`}
                        name="isCurrent"
                        type="checkbox"
                        className="h-4 w-4 accent-primary"
                        defaultChecked={item.isCurrent}
                      />
                      <Label htmlFor={`isCurrent-${item.id}`} className="text-sm">
                        Current position
                      </Label>
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label htmlFor={`description-${item.id}`}>Description</Label>
                      <Textarea id={`description-${item.id}`} name="description" defaultValue={item.description ?? ""} />
                    </div>

                    <div className="md:col-span-2">
                      <Button type="submit" variant="outline" className="w-full gap-2">
                        <Save className="h-4 w-4" />
                        Update Experience
                      </Button>
                    </div>
                  </form>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
