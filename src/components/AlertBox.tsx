// import React, {useCallback} from 'react';
// import {Button, View} from 'react-native';
// import {
//   ALERT_TYPE,
//   Dialog,
//   AlertNotificationRoot,
//   Toast,
// } from 'react-native-alert-notification';

// export const AlertNotification = ({
//   type,
//   title,
//   textBody,
//   button,
//   onPressButton,
// }) => {
//   const onClose = useCallback(() => {
//     Dialog.hide();
//   }, []);
//   return (
//     <AlertNotificationRoot>
//       <View>

//             Dialog.show({
//               type,
//               title,
//               textBody,
//               button,
//               onPressButton: () => {
//                 onPressButton?.();
//                 onClose();
//               },
//             })

        
//         <Button
//           title={'toast notification'}
//           onPress={() =>
//             Toast.show({
//               type: ALERT_TYPE.SUCCESS,
//               title: 'Success',
//               textBody: 'Congrats! this is toast notification success',
//             })
//           }
//         />
//       </View>
//     </AlertNotificationRoot>
//   );
// };
