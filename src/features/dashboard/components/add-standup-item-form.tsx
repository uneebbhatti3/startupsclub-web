"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddStandupItem } from "@/features/dashboard/hooks/use-standup-mutations";
import { standupLimits } from "@/features/dashboard/lib/dashboard-content";

/**
 * One-line form under today's standup items to add another item after posting. Enter or "Add"
 * saves it; the field clears once it is saved.
 *
 * @packageDocumentation
 */

type AddStandupItemFormProps = {
  standupId: string;
};

export function AddStandupItemForm({ standupId }: AddStandupItemFormProps) {
  const [text, setText] = useState("");
  const add = useAddStandupItem();
  const trimmed = text.trim();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (trimmed === "") {
      return;
    }
    add.mutate({ standupId, text: trimmed }, { onSuccess: () => setText("") });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          aria-label="New item"
          value={text}
          maxLength={standupLimits.itemText}
          placeholder="Add an item"
          disabled={add.isPending}
          onChange={(event) => setText(event.target.value)}
        />
        <Button type="submit" variant="outline" disabled={trimmed === "" || add.isPending}>
          <Plus />
          Add
        </Button>
      </div>
      {add.isError ? (
        <p role="alert" className="text-sm text-destructive">
          Could not add that item. Try again.
        </p>
      ) : null}
    </form>
  );
}
