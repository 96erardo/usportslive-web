import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, Paragraph, Row, Button, useModal } from '@8base/boost';

export const modalId = 'decision-dialog';

/**
 * Decision dialog component
 *
 * @returns {React.FC} The component to render
 */
function DecisionDialog() {
  const { isOpen, args } = useModal(modalId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  const title = args.title;
  const text = args.text;
  const color = args.color || 'danger';
  const confirmText = args.confirmText;
  const cancelText = args.cancelText;
  const onClose = args.onClose;
  const onCancel = args.onCancel;

  const handleConfirm = useCallback(() => {
    setLoading(true);

    args.onConfirm();
  }, [args]);

  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header title={title} onClose={onClose} />
      <Dialog.Body>
        <Paragraph>{text}</Paragraph>
      </Dialog.Body>
      <Dialog.Footer>
        <Row alignItems="center" justifyContent="end">
          <Button color="neutral" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button loading={loading} color={color} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
}

export default DecisionDialog;
