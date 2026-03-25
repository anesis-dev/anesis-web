"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon, SearchIcon, XIcon } from "lucide-react";
import { ITemplate } from "@/types/template";
import { cn } from "@/lib/utils";

export interface TemplateFiltersState {
  search: string;
  official: boolean;
  specialization: string | null;
  languages: string[];
  technologies: string[];
}

interface TemplateFiltersProps {
  templates: ITemplate[];
  filters: TemplateFiltersState;
  onChange: (filters: TemplateFiltersState) => void;
}

function deriveUnique(templates: ITemplate[], key: keyof Pick<ITemplate["config"], "languages" | "technologies">): string[] {
  return Array.from(new Set(templates.flatMap((t) => t.config[key]))).sort();
}

function deriveSpecializations(templates: ITemplate[]): string[] {
  return Array.from(new Set(templates.map((t) => t.config.specialization).filter(Boolean))).sort();
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground shrink-0 w-24">
        {label}
      </span>
      {children}
    </div>
  );
}

const DEFAULT_FILTERS: TemplateFiltersState = {
  search: "",
  official: false,
  specialization: null,
  languages: [],
  technologies: [],
};

function isDefault(filters: TemplateFiltersState): boolean {
  return (
    filters.search === "" &&
    !filters.official &&
    filters.specialization === null &&
    filters.languages.length === 0 &&
    filters.technologies.length === 0
  );
}

export function TemplateFilters({
  templates,
  filters,
  onChange,
}: TemplateFiltersProps) {
  const specializations = deriveSpecializations(templates);
  const allLanguages = deriveUnique(templates, "languages");
  const allTechnologies = deriveUnique(templates, "technologies");

  function set<K extends keyof TemplateFiltersState>(
    key: K,
    value: TemplateFiltersState[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  function toggleList(
    key: "languages" | "technologies",
    value: string
  ) {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    set(key, next);
  }

  function toggleSpecialization(value: string) {
    set("specialization", filters.specialization === value ? null : value);
  }

  function reset() {
    onChange(DEFAULT_FILTERS);
  }

  const dirty = !isDefault(filters);

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card px-5 py-4">
      {/* Search row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, description or tag…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="pl-8"
          />
        </div>

        <Button
          type="button"
          variant={filters.official ? "default" : "outline"}
          size="sm"
          onClick={() => set("official", !filters.official)}
          className="gap-1.5 shrink-0"
        >
          <ShieldCheckIcon className="size-3.5" />
          Official only
        </Button>

        {dirty && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reset}
            className="gap-1.5 shrink-0 text-muted-foreground"
          >
            <XIcon className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Specialization */}
      {specializations.length > 0 && (
        <FilterSection label="Specialization">
          {specializations.map((s) => (
            <FilterPill
              key={s}
              label={s}
              active={filters.specialization === s}
              onClick={() => toggleSpecialization(s)}
            />
          ))}
        </FilterSection>
      )}

      {/* Technologies */}
      {allTechnologies.length > 0 && (
        <FilterSection label="Technologies">
          {allTechnologies.map((tech) => (
            <FilterPill
              key={tech}
              label={tech}
              active={filters.technologies.includes(tech)}
              onClick={() => toggleList("technologies", tech)}
            />
          ))}
        </FilterSection>
      )}

      {/* Languages */}
      {allLanguages.length > 0 && (
        <FilterSection label="Languages">
          {allLanguages.map((lang) => (
            <FilterPill
              key={lang}
              label={lang}
              active={filters.languages.includes(lang)}
              onClick={() => toggleList("languages", lang)}
            />
          ))}
        </FilterSection>
      )}
    </div>
  );
}
