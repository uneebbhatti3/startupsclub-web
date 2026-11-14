"use client";

import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";
import type { FieldElement, UseFormHandlerResult } from "@/types/form-types";

/**
 * Generic form-state hook shared across features.
 * Holds the form values and provides change handlers for text-like inputs and file inputs,
 * so each form does not have to re-implement the same state plumbing.
 *
 * @packageDocumentation
 */

/**
 * Manages form values keyed by each field's `name` attribute.
 *
 * @param initialState - Starting values; its shape defines the form's type `T`.
 * @returns `formData`, `setFormData`, `onChange` (text, select, textarea, checkbox) and
 * `onFileChange` (stores `File | null`, or `File[]` when the input has `multiple`).
 */
const useFormHandler = <T extends Record<string, unknown>>(
  initialState: T,
): UseFormHandlerResult<T> => {
  const [formData, setFormData] = useState<T>(initialState);

  const onChange = useCallback((event: ChangeEvent<FieldElement>) => {
    const { name } = event.target;
    // Checkboxes carry their state in `checked`; `value` would always be "on".
    const value =
      event.target instanceof HTMLInputElement && event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, files, multiple } = event.target;
    const fileList = files ? Array.from(files) : [];
    const value = multiple ? fileList : (fileList[0] ?? null);

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return { formData, setFormData, onChange, onFileChange };
};

export default useFormHandler;
