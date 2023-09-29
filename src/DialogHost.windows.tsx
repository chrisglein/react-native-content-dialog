import React, { PropsWithChildren } from 'react';
import {Popup} from 'react-native-windows';

type ContentDialogHostProps = PropsWithChildren<{
  show: boolean,
  close: () => void,
  isLightDismissEnabled?: boolean,
  title: string,
}>;
function ContentDialogHost({children, show, close, isLightDismissEnabled, title}: ContentDialogHostProps): JSX.Element {
  return (
    <Popup
      accessibilityLabel={title}
      isOpen={show}
      isLightDismissEnabled={isLightDismissEnabled}
      onDismiss={() => close()}>
      {children}
    </Popup>
  );
}

export { ContentDialogHost };