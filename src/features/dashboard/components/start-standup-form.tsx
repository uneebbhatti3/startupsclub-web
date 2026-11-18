"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStandup } from "@/features/dashboard/hooks/use-standup-mutations";
import { standupLimits } from "@/features/dashboard/lib/dashboard-content";

/**
 * Inline form for posting today's standup from the dashboard: up to five items (add and remove
 * rows) and an optional blocker. Empty rows are ignored; at least one item is required.
 *
 * @packageDocumentation
 */

type ItemRow = {
  /** Local id for list keys; not sent to the API. */
  id: string;
  text: string;
};

function blankRow(): ItemRow {
  return { id: crypto.randomUUID(), text: "" };
}

type StartStandupFormProps = {
  onCancel: () => void;
};

export function StartStandupForm({ onCancel }: StartStandupFormProps) {
  const [rows, setRows] = useState<ItemRow[]>(() => [blankRow()]);
  const [blockers, setBlockers] = useState("");
  const [showRequired, setShowRequired] = useState(false);
  const create = useCreateStandup();

  const items = rows.map((row) => row.text.trim()).filter((text) => text !== "");

  function updateRow(id: string, text: string) {
    setRows((previous) => previous.map((row) => (row.id === id ? { ...row, text } : row)));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) {
      setShowRequired(true);
      return;
    }
    const blocker = blockers.trim();
    create.mutate({ items, blockers: blocker === "" ? null : blocker });
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">What will you do today?</FieldLegend>
          <ol className="flex flex-col gap-2">
            {rows.map((row, index) => (
              <li key={row.id} className="flex items-center gap-2">
                <Input
                  aria-label={`Item ${index + 1}`}
                  value={row.text}
                  maxLength={standupLimits.itemText}
                  placeholder={index === 0 ? "Ship the pricing page" : "Another item"}
                  autoFocus={index === 0}
                  aria-invalid={showRequired && items.length === 0}
                  onChange={(event) => {
                    updateRow(row.id, event.target.value);
                    setShowRequired(false);
                  }}
                />
                {rows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove item ${index + 1}`}
                    onClick={() =>
                      setRows((previous) => previous.filter((entry) => entry.id !== row.id))
                    }
                  >
                    <X />
                  </Button>
                ) : null}
              </li>
            ))}
          </ol>
          {rows.length < standupLimits.items ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={() => setRows((previous) => [...previous, blankRow()])}
            >
              <Plus />
              Add item
            </Button>
          ) : null}
          {showRequired ? <FieldError>Add at least one item.</FieldError> : null}
        </FieldSet>

        <Field>
          <FieldLabel htmlFor="standup-blockers">Blocker (optional)</FieldLabel>
          <Textarea
            id="standup-blockers"
            value={blockers}
            maxLength={standupLimits.blockers}
            placeholder="Anything in your way?"
            rows={2}
            onChange={(event) => setBlockers(event.target.value)}
          />
        </Field>

        {create.isError ? (
          <p role="alert" className="text-sm text-destructive">
            Could not post your standup. Try again.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Posting…" : "Post standup"}
          </Button>
          <Button type="button" variant="ghost" disabled={create.isPending} onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
