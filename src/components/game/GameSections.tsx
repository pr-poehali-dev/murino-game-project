import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { MenuSection, Skin, GameMode, GAME_MODES, RARITY_COLORS, RARITY_TEXT } from './GameData';

interface GameSectionsProps {
  currentSection: MenuSection;
  onBack: () => void;
  inventory: Skin[];
  coins: number;
  caseOpening: boolean;
  onOpenCase: () => void;
  onUpgradeSkin: (skin: Skin) => void;
  onPlayGame: (mode: GameMode) => void;
}

export default function GameSections({
  currentSection,
  onBack,
  inventory,
  coins,
  caseOpening,
  onOpenCase,
  onUpgradeSkin,
  onPlayGame
}: GameSectionsProps) {
  if (currentSection === 'main') return null;

  return (
    <>
      {currentSection === 'play' && (
        <div className="min-h-screen p-8 animate-fade-in">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-6 border-primary/50"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>

          <h2 className="text-5xl mb-8 text-primary text-horror">Игровые режимы</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {GAME_MODES.map((mode) => (
              <Card key={mode.id} className="bg-card border-primary/30 overflow-hidden hover:border-primary transition-all glow-red cursor-pointer" onClick={() => onPlayGame(mode)}>
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
            onClick={onBack}
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
                onClick={onOpenCase}
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
            onClick={onBack}
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
                      onClick={() => onUpgradeSkin(skin)}
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
            onClick={onBack}
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
            onClick={onBack}
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
            onClick={onBack}
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
    </>
  );
}
