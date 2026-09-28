import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, PanResponder } from 'react-native';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [paths, setPaths] = useState([]);
  const currentPath = useRef([]);

  // محاكاة حركية الـ Canvas العادية بـ React Native الصافي
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        currentPath.current = [{ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY }];
      },
      onPanResponderMove: (evt) => {
        const newPoint = { x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY };
        currentPath.current.push(newPoint);
        setPaths([...paths, [...currentPath.current]]);
      },
    })
  ).current;

  // حلقة الحركة (Animation Loop 60fps)
  useEffect(() => {
    let animationFrame;
    let time = 0;

    const animate = () => {
      time += 0.05;
      // تطبيق اهتزاز الجيلي والانقسام حسابياً على الشاشة
      setPaths((prevPaths) =>
        prevPaths.map((path, pathIdx) =>
          path.map((pt) => ({
            x: pt.x + Math.sin(time + pathIdx) * 1.2 + (Math.random() - 0.5) * 0.5,
            y: pt.y + Math.cos(time + pathIdx) * 1.2 + (Math.random() - 0.5) * 0.5,
          }))
        )
      );
      animationFrame = requestAnimationFrame(animate);
    };

    if (isStarted) {
      animate();
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isStarted]);

  return (
    <View style={styles.container}>
      {!isStarted ? (
        <View style={styles.center}>
          <Text style={styles.title}>محاكاة الجيلي المنقسم 🧪</Text>
          <TouchableOpacity style={styles.btn} onPress={() => setIsStarted(true)}>
            <Text style={styles.btnText}>ابدأ الرسم</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.canvas} {...panResponder.panHandlers}>
          <Text style={styles.hint}>ارسم أي شكل بيدك وشوفه ينقسم ويتهز! 🧬</Text>
          {paths.map((path, i) =>
            path.map((pt, j) => (
              <View
                key={`${i}-${j}`}
                style={[
                  styles.dot,
                  { left: pt.x, top: pt.y, backgroundColor: i % 2 === 0 ? '#00E5FF' : '#FF007F' },
                ]}
              />
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  btn: { backgroundColor: '#38BDF8', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  btnText: { color: '#0F172A', fontSize: 18, fontWeight: 'bold' },
  canvas: { flex: 1 },
  hint: { color: '#94A3B8', textAlign: 'center', marginTop: 50 },
  dot: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
});
