import { useVideoPlayer, VideoView } from 'expo-video';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

/** Muted looping film, like his `<video autoplay muted loop playsinline>`. */
export function Film({ source, style }: { source: number; style?: StyleProp<ViewStyle> }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return <VideoView player={player} style={[StyleSheet.absoluteFill, style]} contentFit="cover" nativeControls={false} allowsPictureInPicture={false} accessible={false} />;
}
