"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface SortableItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

function SortableItem({ project, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-card border border-hairline/20 bg-surface p-3 sm:p-4"
    >
      <button
        type="button"
        className="cursor-grab touch-none flex h-11 w-8 shrink-0 items-center justify-center text-body/50 active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>

      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={project.cover_image_url}
          alt=""
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-sans font-bold text-heading truncate">
          {project.title}
        </p>
        {project.project_date && (
          <p className="text-xs text-body/60 font-medium">
            {new Date(project.project_date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <Button
          type="button"
          variant="secondary"
          className="!px-3 !py-2 !min-h-0 text-xs"
          onClick={() => onEdit(project)}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="danger"
          className="!px-3 !py-2 !min-h-0 text-xs"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

interface SortableProjectListProps {
  projects: Project[];
  category: string;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function SortableProjectList({
  projects,
  category,
  onEdit,
  onDelete,
  onReorder,
}: SortableProjectListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    const orderedIds = reordered.map((p) => p.id);

    onReorder(orderedIds);

    await fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, orderedIds }),
    });
  };

  if (projects.length === 0) {
    return (
      <p className="text-body/60 font-medium text-sm py-4">
        No projects in this category yet.
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={projects.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {projects.map((project) => (
            <SortableItem
              key={project.id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
