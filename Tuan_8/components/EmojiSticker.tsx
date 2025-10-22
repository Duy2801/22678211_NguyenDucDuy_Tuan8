import { ImageSourcePropType, View, Image } from 'react-native';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  return (
    <View style={{ position: 'absolute', top: 40 }}>
      <Image source={stickerSource as any} style={{ width: imageSize, height: imageSize }} />
    </View>
  );
}
