import { useEffect, useRef, useState } from "react";
import { useWindowDimensions, TouchableOpacity, View } from "react-native";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { styles } from "./styles";

type Direction = "up" | "right" | "down" | "left";

type Enemy = {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    direction: Direction;
}

export function Game() {
    const PLAYER_SPEED = 20;
    const PLAYER_MOVEMENT_DELAY = 0;
    const PLAYER_HEIGHT = 40;
    const PLAYER_WIDTH = 40;

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    const [timer, setTimer] = useState<number>();
    const timeoutClearCode = useRef<NodeJS.Timeout | null>(null);

    const direction = useRef<Direction | null>("right");

    function increaseTimer(nextDirection: Direction) {
        direction.current = nextDirection;

        setTimer((previous) => (previous ?? 0) + 1);
        timeoutClearCode.current = setTimeout(() => increaseTimer(nextDirection), PLAYER_MOVEMENT_DELAY);
    }

    function clearTimer() {
        if (timeoutClearCode.current) {
            clearTimeout(timeoutClearCode.current);
        }
    }

    const [playerX, setPlayerX] = useState(windowWidth / 2 - PLAYER_WIDTH / 2);
    const [playerY, setPlayerY] = useState(windowHeight / 2 - PLAYER_HEIGHT / 2);
    
    function handleGoToUp() {
        if (playerY <= 0) {
            return;
        }

        setPlayerY((previous) => previous - PLAYER_SPEED);
    }

    function handleGoToLeft() {
        if (playerX <= 0) {
            return;
        }

        setPlayerX((previous) => previous - PLAYER_SPEED); 
    }

    function handleGoToRight() {
        if (playerX >= windowWidth - PLAYER_WIDTH) {
            return;
        }

        setPlayerX((previous) => previous + PLAYER_SPEED);
    }

    function handleGoToBottom() {
        if (playerY >= windowHeight - PLAYER_HEIGHT - 25) {
            return;
        }

        setPlayerY((previous) => previous + PLAYER_SPEED);
    }

    useEffect(() => {
        if (!timer) {
            return;
        }

        switch (direction.current) {
            case "up":
                handleGoToUp();
                break;
            case "left":
                handleGoToLeft();
                break;
            case "right":
                handleGoToRight();
                break;
            case "down":
                handleGoToBottom();
                break;
        }
    }, [timer]);

    const [isAttacking, setIsAttacking] = useState(false);
    const [swordPosition, setSwordPosition] = useState({ top: 0, left: 0 });

    function getSwordPosition() {
        switch (direction.current) {
            case "up":
                return { top: playerY - PLAYER_HEIGHT, left: playerX };
            case "left":
                return { top: playerY, left: playerX - PLAYER_WIDTH };
            case "right":
                return { top: playerY, left: playerX + PLAYER_WIDTH };
            case "down":
                return { top: playerY + PLAYER_HEIGHT, left: playerX };
            default:
                return { top: 0, left: 0 };
        }
    }

    function handleAttack() {
        setIsAttacking(true);

        setSwordPosition(getSwordPosition());

        setTimeout(() => {
            setIsAttacking(false);
        }, 100);
    }

    const [enemies, setEnemies] = useState<Enemy[]>([]);

    useEffect(() => {
        if (!isAttacking) {
            return;
        }

        const swordX = swordPosition.left;
        const swordY = swordPosition.top;

        const enemiesWhoCollidedWithSword = enemies.filter((enemy) => {
            return (
                swordX < enemy.x + enemy.width &&
                swordX + PLAYER_WIDTH > enemy.x &&
                swordY < enemy.y + enemy.height &&
                swordY + PLAYER_HEIGHT > enemy.y
            );
        });

        if (enemiesWhoCollidedWithSword.length) {
            setEnemies((previous) => previous.filter((enemy) => !enemiesWhoCollidedWithSword.includes(enemy)));
        }
    }, [isAttacking]);


    useEffect(() => {
        function spawnEnemy() {
            const enemy: Enemy = {
                x: Math.random() * windowWidth,
                y: Math.random() * windowHeight,
                width: 40,
                height: 40,
                speed: 5,
                direction: "up",
            };

            setEnemies((previous) => [...previous, enemy]);
        }

        setInterval(() => {
            spawnEnemy();
        }, 3000);
    }, []);

    const enemiesClearCode = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const enemyHasCollidedWithPlayer = enemies.some((enemy) => {
            return (
                playerX < enemy.x + enemy.width &&
                playerX + PLAYER_WIDTH > enemy.x &&
                playerY < enemy.y + enemy.height &&
                playerY + PLAYER_HEIGHT > enemy.y
            );
        });

        if (enemyHasCollidedWithPlayer) {
            alert("Game Over!");
            setEnemies([]);
            return;
        }

        function goToPlayer() {
            const enemiesUpdated = enemies.map((enemy) => {
                if (enemy.x > playerX) {
                    enemy.x -= enemy.speed;
                } else if (enemy.x < playerX) {
                    enemy.x += enemy.speed;
                }

                if (enemy.y > playerY) {
                    enemy.y -= enemy.speed;
                } else if (enemy.y < playerY) {
                    enemy.y += enemy.speed;
                }

                return enemy;
            });

            setEnemies(enemiesUpdated);
        }

        if (enemiesClearCode.current) {
            clearInterval(enemiesClearCode.current);
        }

        enemiesClearCode.current = setTimeout(() => {
            goToPlayer();
        }, 100);
    }, [enemies]);

    return (
        <View style={styles.container}>
            <View style={[styles.player, { left: playerX, top: playerY }]} />
            {isAttacking && <View style={[styles.sword, { left: swordPosition.left, top: swordPosition.top } ]} />}

            {enemies.map((enemy, index) => (
                <View key={index} style={[styles.enemy, { left: enemy.x, top: enemy.y}]} />
            ))}

            <View style={styles.controls}>
                <View style={styles.directionals}>
                    <TouchableOpacity
                        style={styles.directional}
                        onPressIn={() => increaseTimer("up")}
                        onPressOut={clearTimer}
                    >
                        <Feather name="chevron-up" size={34} color="black" />
                    </TouchableOpacity>

                    <View style={styles.leftAndRightDirectionals}>
                        <TouchableOpacity
                            style={styles.directional}
                            onPressIn={() => increaseTimer("left")}
                            onPressOut={clearTimer}
                        >
                            <Feather name="chevron-left" size={34} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.directional}
                            onPressIn={() => increaseTimer("right")}
                            onPressOut={clearTimer}
                        >
                            <Feather name="chevron-right" size={34} color="black" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.directional}
                        onPressIn={() => increaseTimer("down")}
                        onPressOut={clearTimer}
                    >
                        <Feather name="chevron-down" size={34} color="black" />            
                    </TouchableOpacity>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.swordAction}
                        onPressIn={handleAttack}
                        disabled={isAttacking}
                    >
                        <MaterialCommunityIcons name="sword" size={70} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}