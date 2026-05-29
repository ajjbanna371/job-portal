"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_LEVEL, JOB_TYPE, WORK_TYPE } from "@/config/constant";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const JobFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [jobLevel, setJobLevel] = useState(searchParams.get("jobLevel") || "");
  const [workType, setWorkType] = useState(searchParams.get("workType") || "");

  // Sync UI with URL params
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setJobType(searchParams.get("jobType") || "");
    setJobLevel(searchParams.get("jobLevel") || "");
    setWorkType(searchParams.get("workType") || "");
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilters({ search: search });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Update URL filters
  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // 1. Create a tracker to see if anything actually changed
    let filtersChanged = false;

    Object.entries(newParams).forEach(([key, value]) => {
      const actualValue = value?.trim();
      const currentValue = params.get(key) || "";

      if (!actualValue || actualValue === "all") {
        if (params.has(key)) {
          params.delete(key);
          filtersChanged = true;
        }
      } else {
        if (currentValue !== actualValue) {
          params.set(key, actualValue);
          filtersChanged = true;
        }
      }
    });

    //  2. ONLY reset the page and push to the router if a filter ACTUALLY changed
    if (filtersChanged) {
      // params.delete("page");
      params.set("page", "1");
      router.push(`?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  // Reset all filters
  const clearFilters = () => {
    setSearch("");
    setJobType("");
    setJobLevel("");
    setWorkType("");

    router.push("/jobs", {
      scroll: false,
    }); // Reset to base URL
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Row 1: Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <Input
          placeholder="Search by title, skill, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 bg-gray-50/50 pl-10"
        />
      </div>

      {/* Row 2: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Job Type */}

        <Select
          value={jobType}
          onValueChange={(val) => {
            const value = val === "all" ? "" : val;
            setJobType(value);
            updateFilters({ jobType: value });
          }}
        >
          <SelectTrigger className="h-9 w-[170px] text-xs">
            <SelectValue placeholder="Select Job Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Job Types</SelectItem>

            {JOB_TYPE.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Job Level */}
        <Select
          value={jobLevel}
          onValueChange={(val) => {
            const value = val === "all" ? "" : val;
            setJobLevel(value);
            updateFilters({ jobLevel: value });
          }}
        >
          <SelectTrigger className="h-9 w-[170px] text-xs">
            <SelectValue placeholder="Select Job Level" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Job Levels</SelectItem>

            {JOB_LEVEL.map((level) => (
              <SelectItem key={level} value={level} className="capitalize">
                {level.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Work Type */}
        <Select
          value={workType}
          onValueChange={(val) => {
            const value = val === "all" ? "" : val;
            setWorkType(value);

            updateFilters({
              workType: value,
            });
          }}
        >
          <SelectTrigger className="h-9 w-[170px] text-xs">
            <SelectValue placeholder="Select Work Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Work Types</SelectItem>

            {WORK_TYPE.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {(search || jobType || jobLevel || workType) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <X className="mr-1 h-4 w-4" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};
