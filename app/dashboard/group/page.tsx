"use client";

import { Icon, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GroupPage(): React.ReactElement {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Stokvels</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your stokvels and memberships
          </p>
        </div>
        <Button variant="default">
          <Plus className="h-4 w-4" />
          Create Stokvel
        </Button>
      </div>


      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No stokvels yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-4">Create your first stokvel or join an existing one to get started</p>
        <Button>Create Stokvel</Button>
      </div>
    </div>
  );
} 
