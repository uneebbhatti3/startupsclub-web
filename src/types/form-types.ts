import type { ChangeEvent, Dispatch, SetStateAction } from "react";

/**
 * Shared types for form handling, used by the `useFormHandler` hook.
 *
 * @packageDocumentation
 */

/** Form elements whose change events `onChange` accepts. */
export type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** What `useFormHandler<T>` returns. */
export type UseFormHandlerResult<T extends Record<string, unknown>> = {
  formData: T;
  setFormData: Dispatch<SetStateAction<T>>;
  onChange: (event: ChangeEvent<FieldElement>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
