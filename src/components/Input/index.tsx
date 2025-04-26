import { Input as InputComponent } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <InputComponent {...props} />
    </div>
  );
}
