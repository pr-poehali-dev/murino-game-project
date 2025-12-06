import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Skin {
  id: string;
  name: string;
  rarity: Rarity;
  image: string;
  description: string;
  ability?: {
    name: string;
    damage: number;
    cooldown: number;
  };
  level: number;
  health: number;
  power: number;
}

interface GameMode {
  id: string;
  name: string;
  reward: number;
  image: string;
  description: string;
}

type MenuSection = 'main' | 'play' | 'inventory' | 'shop' | 'settings' | 'leaderboard' | 'about';

const SKINS: Omit<Skin, 'level' | 'health' | 'power'>[] = [
  {
    id: 'skin1',
    name: 'Ч',
    rarity: 'rare',
    image: 'https://static50.tgcnt.ru/posts/_0/9f/9ffe33fbfb2f0ff16ee84648c4f5c664.jpg',
    description: 'Редкий скин'
  },
  {
    id: 'skin2',
    name: 'Друн',
    rarity: 'epic',
    image: 'https://i.pinimg.com/originals/58/d6/c2/58d6c284ead7608b9abaee364cc736ff.jpg',
    description: 'Сосиски и в Мурино. Елисей',
    ability: {
      name: 'Съесть противника',
      damage: 50,
      cooldown: 30
    }
  },
  {
    id: 'skin3',
    name: 'Друн 2',
    rarity: 'legendary',
    image: 'https://yt3.googleusercontent.com/r49JSqa6HeuZDguU99JHSSx8xSS4KSedcYvSxU6AEhDi1tFdcAIY2iN4uuh9sbELUsMAG9QmkA=s900-c-k-c0x00ffffff-no-rj',
    description: 'Ой бля... Паша.',
    ability: {
      name: 'Лазеры из глаз',
      damage: 60,
      cooldown: 20
    }
  }
];

const GAME_MODES: GameMode[] = [
  {
    id: 'catch',
    name: 'Поймай Фога',
    reward: 5,
    image: 'https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg',
    description: 'Быстрая реакция = монеты'
  },
  {
    id: 'bushes',
    name: 'Найди в кустах',
    reward: 40,
    image: 'https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg',
    description: 'Поиск в темноте'
  },
  {
    id: 'tictactoe',
    name: 'Крестики-нолики',
    reward: 70,
    image: 'https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg',
    description: 'Переиграй Фога'
  },
  {
    id: 'boss',
    name: 'Бой с Фогом',
    reward: 0,
    image: 'https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg',
    description: 'Требуется скин'
  }
];

const RARITY_CHANCES = {
  common: 0.90,
  rare: 0.05,
  epic: 0.03,
  legendary: 0.02
};

const RARITY_COLORS = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

const RARITY_TEXT = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный'
};

export default function Index() {
  const [currentSection, setCurrentSection] = useState<MenuSection>('main');
  const [coins, setCoins] = useState(100);
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [caseOpening, setCaseOpening] = useState(false);
  const [wonItem, setWonItem] = useState<Skin | null>(null);

  const openCase = () => {
    if (coins < 100) {
      toast({
        title: "Недостаточно монет",
        description: "Нужно 100 монет для открытия кейса",
        variant: "destructive"
      });
      return;
    }

    setCaseOpening(true);
    setCoins(coins - 100);

    setTimeout(() => {
      const random = Math.random();
      let cumulativeChance = 0;
      let wonRarity: Rarity = 'common';

      for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
        cumulativeChance += chance;
        if (random <= cumulativeChance) {
          wonRarity = rarity as Rarity;
          break;
        }
      }

      if (wonRarity === 'common') {
        setCoins(prev => prev + 25);
        toast({
          title: "Выпало 25 монет!",
          description: "Попробуйте еще раз"
        });
        setCaseOpening(false);
      } else {
        const availableSkins = SKINS.filter(s => s.rarity === wonRarity);
        const randomSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        
        const newSkin: Skin = {
          ...randomSkin,
          level: 1,
          health: 60,
          power: randomSkin.ability?.damage || 10
        };

        setWonItem(newSkin);
        setInventory(prev => [...prev, newSkin]);
        setCaseOpening(false);
      }
    }, 2000);
  };

  const upgradeSkin = (skin: Skin) => {
    if (skin.level >= 10) {
      toast({
        title: "Максимальный уровень",
        description: "Этот скин уже прокачан до максимума",
        variant: "destructive"
      });
      return;
    }

    const upgradeCost = skin.level * 50;
    if (coins < upgradeCost) {
      toast({
        title: "Недостаточно монет",
        description: `Нужно ${upgradeCost} монет для прокачки`,
        variant: "destructive"
      });
      return;
    }

    setCoins(coins - upgradeCost);
    setInventory(prev => prev.map(s => 
      s.id === skin.id && s.level === skin.level
        ? { ...s, level: s.level + 1, health: s.health + 10, power: s.power + 5 }
        : s
    ));

    toast({
      title: "Прокачка успешна!",
      description: `${skin.name} теперь ${skin.level + 1} уровня`
    });
  };

  const playGame = (mode: GameMode) => {
    if (mode.id === 'boss' && inventory.length === 0) {
      toast({
        title: "Требуется скин",
        description: "Откройте кейс, чтобы получить скин для боя",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `${mode.name}`,
      description: "Игровой режим скоро будет доступен"
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30 glow-red">
        <Icon name="Coins" className="text-primary" size={24} />
        <span className="text-xl font-bold text-horror">{coins}</span>
      </div>

      {currentSection === 'main' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="text-center mb-12 animate-scale-in">
            <h1 className="text-7xl md:text-9xl mb-4 text-primary text-horror animate-pulse-glow">
              МУРИНО
            </h1>
            <p className="text-xl text-muted-foreground">Тёмная игра с Фогом</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full">
            {[
              { id: 'play', icon: 'Gamepad2', label: 'Играть' },
              { id: 'inventory', icon: 'Package', label: 'Инвентарь' },
              { id: 'shop', icon: 'ShoppingCart', label: 'Магазин' },
              { id: 'settings', icon: 'Settings', label: 'Настройки' },
              { id: 'leaderboard', icon: 'Trophy', label: 'Рейтинг' },
              { id: 'about', icon: 'Info', label: 'О игре' }
            ].map((item) => (
              <Button
                key={item.id}
                onClick={() => setCurrentSection(item.id as MenuSection)}
                className="h-32 text-2xl bg-card hover:bg-card/80 border-2 border-primary/50 hover:border-primary transition-all glow-red hover:glow-red-intense"
                variant="outline"
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon name={item.icon as any} size={40} className="text-primary" />
                  <span className="text-horror">{item.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {currentSection === 'play' && (
        <div className="min-h-screen p-8 animate-fade-in">
          <Button
            onClick={() => setCurrentSection('main')}
            variant="outline"
            className="mb-6 border-primary/50"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>

          <h2 className="text-5xl mb-8 text-primary text-horror">Игровые режимы</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {GAME_MODES.map((mode) => (
              <Card key={mode.id} className="bg-card border-primary/30 overflow-hidden hover:border-primary transition-all glow-red cursor-pointer" onClick={() => playGame(mode)}>
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img 
                    src={mode.image} 
                    alt={mode.name}
                    className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl mb-2 text-horror">{mode.name}</h3>
                  <p className="text-muted-foreground mb-4">{mode.description}</p>
                  {mode.reward > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Icon name="Coins" size={16} className="mr-1" />
                      +{mode.reward} монет
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentSection === 'shop' && (
        <div className="min-h-screen p-8 animate-fade-in">
          <Button
            onClick={() => setCurrentSection('main')}
            variant="outline"
            className="mb-6 border-primary/50"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>

          <h2 className="text-5xl mb-8 text-primary text-horror">Магазин</h2>

          <Card className="max-w-md bg-card border-primary/30 glow-red">
            <CardContent className="p-6">
              <div className="aspect-square relative overflow-hidden rounded-lg mb-4 bg-black">
                <img 
                  src="https://i.pinimg.com/736x/19/76/6a/19766a24fd4b60d3411f5891854fbd29.jpg"
                  alt="Mystery Case"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-3xl mb-2 text-horror">Таинственный кейс</h3>
              <p className="text-muted-foreground mb-4">
                Содержит редкие скины или монеты
              </p>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>25 монет</span>
                  <span className="text-gray-500">90%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">Редкий скин</span>
                  <span className="text-blue-400">5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Эпический скин</span>
                  <span className="text-purple-400">3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">Легендарный скин</span>
                  <span className="text-yellow-400">2%</span>
                </div>
              </div>
              <Button
                onClick={openCase}
                disabled={caseOpening || coins < 100}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {caseOpening ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" />
                    Открытие...
                  </>
                ) : (
                  <>
                    <Icon name="Package" className="mr-2" />
                    Открыть за 100 монет
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {currentSection === 'inventory' && (
        <div className="min-h-screen p-8 animate-fade-in">
          <Button
            onClick={() => setCurrentSection('main')}
            variant="outline"
            className="mb-6 border-primary/50"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>

          <h2 className="text-5xl mb-8 text-primary text-horror">Инвентарь</h2>

          {inventory.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="Package" size={80} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">Инвентарь пуст</p>
              <p className="text-muted-foreground">Откройте кейс в магазине</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
              {inventory.map((skin, idx) => (
                <Card key={`${skin.id}-${idx}`} className="bg-card border-primary/30 overflow-hidden hover:border-primary transition-all glow-red">
                  <div className="aspect-square relative overflow-hidden bg-black">
                    <img 
                      src={skin.image} 
                      alt={skin.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className={`absolute top-2 right-2 ${RARITY_COLORS[skin.rarity]}`}>
                      {RARITY_TEXT[skin.rarity]}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl mb-2 text-horror">{skin.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{skin.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Уровень:</span>
                        <span className="font-bold text-primary">{skin.level}/10</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Здоровье:</span>
                        <span>{skin.health} HP</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Сила:</span>
                        <span>{skin.power}</span>
                      </div>
                      {skin.ability && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-sm font-bold text-primary">{skin.ability.name}</p>
                          <p className="text-xs text-muted-foreground">Урон: {skin.power}, КД: {skin.ability.cooldown}с</p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => upgradeSkin(skin)}
                      disabled={skin.level >= 10}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      {skin.level >= 10 ? 'Макс. уровень' : `Прокачать (${skin.level * 50} монет)`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {currentSection === 'settings' && (
        <div className="min-h-screen p-8 animate-fade-in">
          <Button
            onClick={() => setCurrentSection('main')}
            variant="outline"
            className="mb-6 border-primary/50"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>

          <h2 className="text-5xl mb-8 text-primary text-horror">Настройки</h2>
          <Card className="max-w-2xl bg-card border-primary/30 glow-red">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Настройки скоро будут доступны</p>
            </CardContent>
          </Card>
        </div>
      )}

      {currentSection === 'leaderboard' && (
        <div className="min-h-screen p-8 animate-fade-in">
          <Button
            onClick={() => setCurrentSection('main')}
            variant="outline"
            className="mb-6 border-primary/50"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>

          <h2 className="text-5xl mb-8 text-primary text-horror">Рейтинг</h2>
          <Card className="max-w-2xl bg-card border-primary/30 glow-red">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Таблица лидеров скоро будет доступна</p>
            </CardContent>
          </Card>
        </div>
      )}

      {currentSection === 'about' && (
        <div className="min-h-screen p-8 animate-fade-in">
          <Button
            onClick={() => setCurrentSection('main')}
            variant="outline"
            className="mb-6 border-primary/50"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>

          <h2 className="text-5xl mb-8 text-primary text-horror">О игре</h2>
          <Card className="max-w-2xl bg-card border-primary/30 glow-red">
            <CardContent className="p-6">
              <h3 className="text-2xl mb-4 text-horror">МУРИНО</h3>
              <p className="text-muted-foreground mb-4">
                Хоррор-игра с элементами коллекционирования и боевой системы.
                Собирайте монеты, открывайте кейсы, прокачивайте скины и сражайтесь с Фогом.
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="text-primary">Версия:</span> 1.0.0</p>
                <p><span className="text-primary">Жанр:</span> Хоррор / Коллекционирование</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={wonItem !== null} onOpenChange={() => setWonItem(null)}>
        <DialogContent className="bg-card border-primary/30 glow-red-intense">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center text-horror animate-pulse-glow">
              🎉 Поздравляем! 🎉
            </DialogTitle>
          </DialogHeader>
          {wonItem && (
            <div className="text-center">
              <div className="aspect-square max-w-xs mx-auto mb-4 rounded-lg overflow-hidden">
                <img 
                  src={wonItem.image} 
                  alt={wonItem.name}
                  className="w-full h-full object-cover animate-scale-in"
                />
              </div>
              <Badge className={`mb-2 ${RARITY_COLORS[wonItem.rarity]}`}>
                {RARITY_TEXT[wonItem.rarity]}
              </Badge>
              <h3 className="text-2xl mb-2 text-horror">{wonItem.name}</h3>
              <p className="text-muted-foreground mb-4">{wonItem.description}</p>
              {wonItem.ability && (
                <div className="bg-muted/20 p-4 rounded-lg">
                  <p className="font-bold text-primary mb-1">{wonItem.ability.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Урон: {wonItem.ability.damage} | КД: {wonItem.ability.cooldown}с
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}