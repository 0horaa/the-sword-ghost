import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { loadAsync } from "expo-font";
import { Orbitron_400Regular, Orbitron_500Medium, Orbitron_700Bold } from "@expo-google-fonts/orbitron";
import { hideAsync } from "expo-splash-screen";

import { Background } from "./src/components/Background";
import { Game } from "./src/screens/Game";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadAsync({ Orbitron_400Regular, Orbitron_500Medium, Orbitron_700Bold });
      } catch (error) {
        console.warn(error);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Background>
          <StatusBar
            style="light"
            backgroundColor="#0d331e"
            translucent={false}
          />
          <Game />
        </Background>
      </View>
  );
}

