import React, { PropsWithChildren } from 'react';
import {
  Modal,
} from 'react-native';

type ContentDialogHostProps = PropsWithChildren<{
  show: boolean,
  close: () => void,
  isLightDismissEnabled?: boolean,
  title: string,
}>;
function ContentDialogHost({children, show, close, title}: ContentDialogHostProps): JSX.Element {
  return (
    <Modal
      accessibilityLabel={title}
      visible={show}
      onRequestClose={() => close()}>
      {children}
    </Modal>
  );
}

export { ContentDialogHost };