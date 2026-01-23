import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import CloseCameraSvg from '../features/drawer/svgimgcomponents/CloseCameraSvg';
import { hScale, wScale } from '../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxUtils/store';

interface ImagePreviewModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

const SimpleImageViwer: React.FC<ImagePreviewModalProps> = ({
  visible,
  imageUri,
  onClose,
}) => {
  // if (!imageUri) return null;
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const secondaryColorWithOpacity = `${colorConfig.secondaryColor}40`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.imageModalBackdrop}>
        <View style={[styles.imageModalContainer,]}>
          <View style={[{ backgroundColor: secondaryColorWithOpacity, width: '100%', height: '100%', padding: wScale(2) }]}>
            <View style={[styles.closeButton,]}>


              <TouchableOpacity
                style={[styles.reUploadButton,]}
              >
                <Text style={styles.closeButtonText}>Your uploaded slip</Text>
              </TouchableOpacity>



              <TouchableOpacity onPress={onClose}>
                <CloseCameraSvg />
              </TouchableOpacity>
            </View>
            <ImageViewer
              imageUrls={[{ url: imageUri }]}
              enableSwipeDown
              onSwipeDown={onClose}
              enableImageZoom
              style={styles.imgStyle}
              backgroundColor='rgba(0,0,0,0.1)'

            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SimpleImageViwer;

const styles = StyleSheet.create({
  imageModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',

  },
  imageModalContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  closeButton: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hScale(4),
    paddingHorizontal: wScale(10),
  },
  reUploadButton: {
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(2.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hScale(40),
    flex: 1,
  },
  closeButtonText: {
    color: '#000',
    fontSize: wScale(20),
    fontWeight: 'bold',
    paddingLeft: wScale(5),
    textTransform: 'uppercase'

  },
  container: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  imgStyle: {
    borderRadius: 10,
              backgroundColor:'rgba(0,0,0,0.5)'
  }
});
