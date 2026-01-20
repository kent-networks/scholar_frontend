import React from "react";
import ModalDialog from "./ModalDialog";

const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  confirmDanger = false,
}) => {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={title} width="md">
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              confirmDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#560fd1] hover:bg-[#560fd1]/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalDialog>
  );
};

export default ConfirmActionModal;
