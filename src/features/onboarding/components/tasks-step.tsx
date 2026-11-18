"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { newId } from "@/features/onboarding/hooks/use-onboarding-wizard";
import { onboardingLimits } from "@/features/onboarding/lib/onboarding-content";
import type { TaskDraft } from "@/features/onboarding/types/onboarding-types";

/**
 * Step 6, "First tasks": the suggested tasks with a tick to keep each one, a remove button, and
 * a field to add your own (Enter or the plus button). Own tasks get an `own-` id so a new focus
 * keeps them.
 *
 * @packageDocumentation
 */

type TasksStepProps = {
  tasks: TaskDraft[];
  onChange: (tasks: TaskDraft[]) => void;
};

export function TasksStep({ tasks, onChange }: TasksStepProps) {
  const [newTask, setNewTask] = useState("");
  const isFull = tasks.length >= onboardingLimits.tasks;

  function addTask() {
    const title = newTask.trim();
    if (!title || isFull) {
      return;
    }
    onChange([...tasks, { id: `own-${newId()}`, title, selected: true }]);
    setNewTask("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 rounded-lg border p-3">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.selected}
                onCheckedChange={(checked) =>
                  onChange(
                    tasks.map((item) =>
                      item.id === task.id ? { ...item, selected: checked } : item,
                    ),
                  )
                }
              />
              <label htmlFor={`task-${task.id}`} className="flex-1 text-sm font-medium">
                {task.title}
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove "${task.title}"`}
                onClick={() => onChange(tasks.filter((item) => item.id !== task.id))}
              >
                <X aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No tasks yet. Add the first one below.</p>
      )}
      <div className="flex gap-2">
        <label htmlFor="onboarding-new-task" className="sr-only">
          Add your own task
        </label>
        <Input
          id="onboarding-new-task"
          placeholder={isFull ? "Task limit reached" : "Add your own…"}
          maxLength={onboardingLimits.taskTitle}
          value={newTask}
          disabled={isFull}
          onChange={(event) => setNewTask(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Add task"
          disabled={isFull || newTask.trim() === ""}
          onClick={addTask}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
