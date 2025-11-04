import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface AddFacultyButtonProps {
  onAdd: () => void;
}

export function AddFacultyButton({ onAdd }: AddFacultyButtonProps) {
  return (
    <Button onClick={onAdd} className="w-full sm:w-auto">
      <PlusIcon className="h-4 w-4 mr-2" />
      Add Faculty
    </Button>
  );
}