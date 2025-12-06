import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CatchFogGameProps {
  roomId: string;
  playerName: string;
  players: { name: string; score: number }[];
  onLeave: () => void;
}

const ONLINE_API = 'https://functions.poehali.dev/ac39491b-c7e4-458d-bd38-2b7911ac5945';
const GAME_DURATION = 30;
const FOG_SPAWN_INTERVAL = 1500;

export default function CatchFogGame({ roomId, playerName, players, onLeave }: CatchFogGameProps) {
  const [gameTime, setGameTime] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [fogPosition, setFogPosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [allPlayers, setAllPlayers] = useState(players);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const fogTimer = setInterval(() => {
      setIsVisible(true);
      setFogPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10
      });

      setTimeout(() => {
        setIsVisible(false);
      }, 1200);
    }, FOG_SPAWN_INTERVAL);

    return () => clearInterval(fogTimer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${ONLINE_API}?room_id=${roomId}`);
        const data = await response.json();
        if (data.success) {
          setAllPlayers(data.room.players);
        }
      } catch (error) {
        console.error('Ошибка обновления счета:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId, gameOver]);

  const catchFog = async () => {
    if (!isVisible || gameOver) return;

    const newScore = score + 10;
    setScore(newScore);
    setIsVisible(false);

    try {
      await fetch(ONLINE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_score',
          room_id: roomId,
          player_name: playerName,
          score: newScore
        })
      });
    } catch (error) {
      console.error('Ошибка обновления очков:', error);
    }
  };

  const sortedPlayers = [...allPlayers].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold text-horror">
          <Icon name="Timer" className="inline mr-2" />
          {gameTime}с
        </div>
        <div className="text-2xl font-bold text-primary">
          <Icon name="Target" className="inline mr-2" />
          {score} очков
        </div>
      </div>

      {!gameOver ? (
        <>
          <Card className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border-primary/30 overflow-hidden" 
                style={{ height: '400px' }}>
            <CardContent className="p-0 h-full relative">
              <div className="absolute inset-0 bg-[url('https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg')] opacity-20 bg-cover bg-center" />
              
              {isVisible && (
                <button
                  onClick={catchFog}
                  className="absolute w-20 h-20 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer bg-transparent border-0 animate-pulse"
                  style={{
                    left: `${fogPosition.x}%`,
                    top: `${fogPosition.y}%`
                  }}
                >
                  <div className="text-6xl animate-bounce">👻</div>
                </button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/30">
            <CardContent className="p-4">
              <h4 className="text-lg font-bold mb-2 text-horror">Счет игроков:</h4>
              <div className="space-y-2">
                {sortedPlayers.map((player, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={player.name === playerName ? 'font-bold text-primary' : ''}>
                      {idx + 1}. {player.name}
                    </span>
                    <span className="text-primary font-bold">{player.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="bg-card border-primary/30 glow-red-intense">
          <CardContent className="p-8 text-center">
            <Icon name="Trophy" size={80} className="mx-auto mb-4 text-yellow-500 animate-bounce" />
            <h3 className="text-3xl mb-4 text-horror">Игра окончена!</h3>
            
            <div className="mb-6">
              <p className="text-xl mb-2">Победитель:</p>
              <p className="text-4xl font-bold text-primary animate-pulse-glow">
                {winner.name}
              </p>
              <p className="text-2xl text-yellow-500 mt-2">{winner.score} очков</p>
            </div>

            <div className="mb-6 space-y-2">
              <h4 className="text-xl text-horror mb-3">Итоговый счет:</h4>
              {sortedPlayers.map((player, idx) => (
                <div key={idx} className="flex justify-between items-center text-lg">
                  <span className={player.name === playerName ? 'font-bold text-primary' : ''}>
                    {idx + 1}. {player.name}
                  </span>
                  <span className="font-bold text-primary">{player.score}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={onLeave}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Покинуть комнату
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
