import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { Loader2 } from "lucide-react";
import { setIsDeleteDialogOpen, setSelectedDeleteId } from "@/store/slices/handover/handoverSlice";

interface Props {
  onConfirm: (id: string) => void;
}

export const DeleteConfirmationDialog = ({ onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.handover.ui.isDeleteDialogOpen);
  const selectedId = useAppSelector((state) => state.handover.ui.selectedDeleteId);
  const isLoading = useAppSelector((state) => state.handover.isLoading);
  const selectedProfileId = useAppSelector((state) => state.profile.selectedDeleteId);

console.log("selectedProfileId", selectedProfileId)

  const handleCancel = () => {
    dispatch(setIsDeleteDialogOpen(false));
    dispatch(setSelectedDeleteId(null));
  };
const handleConfirm = () => {
  const idToDelete = selectedId || selectedProfileId;

  if (idToDelete) {
    onConfirm(idToDelete);
  }
};


  return (
    <Dialog open={isOpen} onOpenChange={(open) => dispatch(setIsDeleteDialogOpen(open))}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
