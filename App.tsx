import { StatusBar } from "expo-status-bar";

import { Background } from "./src/components/Background";
import { Game } from "./src/screens/Game";

export default function App() {
  return (
      <Background>
        <StatusBar
          style="light"
          backgroundColor="#0d331e"
          translucent={false}
        />
        <Game />
      </Background>
  );
}

