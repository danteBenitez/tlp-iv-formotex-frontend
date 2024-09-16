import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export type DeleteButtonProps = {
  id: number;
  mutationKey: string[];
  onDelete: (id: number) => Promise<void>;
  dialogText?: {
    title?: string;
    description?: string;
  };
  dialog?: ReactNode;
};

export default function DeleteButton(props: DeleteButtonProps) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: number) => {
      return props.onDelete(id);
    },
    mutationKey: props.mutationKey,
  });
  const [show, setShow] = useState(false);

  return (
    <>
      <Dialog open={show} modal={true} onOpenChange={(open) => setShow(open)}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            onClick={() => setShow(true)}
            disabled={isPending}
          >
            Eliminar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {props.dialog ? (
            props.dialog
          ) : (
            <DialogHeader className="flex flex-col gap-5">
              <DialogTitle>
                {props.dialogText && props.dialogText.title}
              </DialogTitle>
              <DialogDescription>
                {props.dialogText && props.dialogText.description}
              </DialogDescription>
            </DialogHeader>
          )}
          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  setShow(false);
                }}
                variant="secondary"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              type="submit"
              variant="destructive"
              onClick={async () => {
                await mutateAsync(props.id);
                setShow(false);
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
