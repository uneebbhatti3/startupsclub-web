"use client";

import { useState, type FormEvent } from "react";

import useFormHandler from "@/hooks/use-form-handler";
import type { ApiError } from "@/lib/api-error";
import { useJoinWaitlist } from "@/features/waitlist/hooks/use-join-waitlist";
import {
  waitlistErrorMessages,
  waitlistFieldErrors,
} from "@/features/waitlist/lib/waitlist-content";
import type {
  JoinWaitlistRequest,
  WaitlistField,
  WaitlistFormData,
  WaitlistRole,
} from "@/features/waitlist/types/waitlist-types";

/**
 * State and actions for the waitlist form. Values live in `useFormHandler<WaitlistFormData>`;
 * submitting sends them through `useJoinWaitlist`. On success the form values are cleared and
 * the saved email is kept for the confirmation message; on error the API's code is turned into
 * a plain message and any rejected fields are marked.
 *
 * @packageDocumentation
 */

const initialWaitlistForm: WaitlistFormData = {
  name: "",
  email: "",
  role: "",
  roleOther: "",
};

type WaitlistFormError = {
  message: string;
  fields: Partial<Record<WaitlistField, string>>;
};

const FIELD_NAMES = new Set<string>(Object.keys(initialWaitlistForm));

function isWaitlistField(field: string): field is WaitlistField {
  return FIELD_NAMES.has(field);
}

/** Builds the request body; `roleOther` is sent only for "other", as the API requires. */
function toRequest(form: WaitlistFormData, role: WaitlistRole): JoinWaitlistRequest {
  const base = { name: form.name, email: form.email, role };
  return role === "other" ? { ...base, roleOther: form.roleOther } : base;
}

function toFormError(error: ApiError): WaitlistFormError {
  const fields: WaitlistFormError["fields"] = {};
  for (const detail of error.details) {
    if (isWaitlistField(detail.field)) {
      fields[detail.field] = waitlistFieldErrors[detail.field];
    }
  }
  return { message: waitlistErrorMessages[error.code] ?? error.message, fields };
}

export function useWaitlistForm() {
  const { formData, setFormData, onChange } = useFormHandler<WaitlistFormData>(initialWaitlistForm);
  const [formError, setFormError] = useState<WaitlistFormError | null>(null);
  const [joinedEmail, setJoinedEmail] = useState<string | null>(null);

  const mutation = useJoinWaitlist({
    onSuccess: (entry) => {
      setJoinedEmail(entry.email);
      setFormData(initialWaitlistForm);
    },
    onError: (error) => setFormError(toFormError(error)),
  });

  /** The role comes from a shadcn Select, which reports a value rather than a change event. */
  function onRoleChange(role: WaitlistRole | null) {
    setFormData((prev) => ({
      ...prev,
      role: role ?? "",
      roleOther: role === "other" ? prev.roleOther : "",
    }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Without this the browser would submit as GET and put the values in the URL.
    event.preventDefault();
    // The browser's `required` check normally stops this; the guard also narrows the type.
    if (formData.role === "" || mutation.isPending) {
      return;
    }
    setFormError(null);
    mutation.mutate(toRequest(formData, formData.role));
  }

  return {
    formData,
    onChange,
    onRoleChange,
    onSubmit,
    isPending: mutation.isPending,
    formError,
    joinedEmail,
  };
}
