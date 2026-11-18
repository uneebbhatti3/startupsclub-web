import { CircleAlert, CircleCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * The one message box the auth forms use: a destructive alert for failures and a neutral one for
 * confirmations (such as "New link sent").
 *
 * @packageDocumentation
 */

type AuthAlertProps = {
  tone: "error" | "success";
  title: string;
  message: string;
};

export function AuthAlert({ tone, title, message }: AuthAlertProps) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <Alert variant={tone === "error" ? "destructive" : "default"}>
      <Icon aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
