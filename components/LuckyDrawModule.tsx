import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCcw, Settings, History } from 'lucide-react';
import { Participant, DrawHistoryItem } from '../types';
import { Button } from './ui/Button';

interface LuckyDrawModuleProps {
  participants: Participant[];
}

export const LuckyDrawModule: React.FC<LuckyDrawModuleProps> = ({ participants }) => {
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [displayId, setDisplayId] = useState<string | null>(null); // ID for animation loop
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [history, setHistory] = useState<DrawHistoryItem[]>([]);
  const [availablePool, setAvailablePool] = useState<Participant[]>(participants);

  // Sync available pool when participants change or reset
  useEffect(() => {
    // Only reset pool if it wasn't a result of a draw action
    if (!isRolling && history.length === 0) {
      setAvailablePool(participants);
    }
  }, [participants]);

  const resetPool = () => {
    setAvailablePool(participants);
    setHistory([]);
    setCurrentWinner(null);
  };

  const startDraw = useCallback(() => {
    if (availablePool.length === 0) {
      alert("所有名單已抽完！請重置名單。");
      return;
    }

    setIsRolling(true);
    setCurrentWinner(null);

    let speed = 50;
    let counter = 0;
    const maxCount = 25; // How many shuffles before stop

    const shuffle = () => {
      // Pick a random visual candidate
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      setDisplayId(availablePool[randomIndex].id);

      counter++;
      
      if (counter < maxCount) {
        // Slow down effect
        if (counter > maxCount - 10) speed += 30;
        if (counter > maxCount - 5) speed += 50;
        setTimeout(shuffle, speed);
      } else {
        // Final Winner Logic
        const finalIndex = Math.floor(Math.random() * availablePool.length);
        const winner = availablePool[finalIndex];
        
        setCurrentWinner(winner);
        setDisplayId(winner.id);
        setIsRolling(false);
        
        setHistory(prev => [{ winner, timestamp: Date.now() }, ...prev]);

        if (!allowRepeats) {
          setAvailablePool(prev => prev.filter(p => p.id !== winner.id));
        }
      }
    };

    shuffle();
  }, [availablePool, allowRepeats]);

  // Find the name object for the current display ID
  const displayName = availablePool.find(p => p.id === displayId)?.name || currentWinner?.name || "?";

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
      {/* Main Draw Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 relative">
          
          {/* Header / Settings */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
             <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 text-sm text-gray-600">
                <Settings className="w-4 h-4" />
                <label className="flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={allowRepeats} 
                    onChange={(e) => setAllowRepeats(e.target.checked)}
                    className="mr-2 rounded text-indigo-600 focus:ring-indigo-500"
                    disabled={isRolling}
                  />
                  允許重複中獎
                </label>
             </div>
          </div>

          <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            {/* Winner Display */}
            <div className="relative z-10 text-center w-full px-4">
              <div className="mb-4 text-white/80 text-lg uppercase tracking-widest font-semibold">
                {isRolling ? "正在抽出..." : currentWinner ? "恭喜獲獎" : "準備抽籤"}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={displayName}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -20 }}
                  transition={{ duration: 0.1 }}
                  className={`text-6xl md:text-8xl font-black text-white drop-shadow-lg tracking-tight ${isRolling ? 'blur-[1px]' : ''}`}
                >
                  {displayName}
                </motion.div>
              </AnimatePresence>

              {currentWinner && !isRolling && (
                 <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 inline-block bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-bold shadow-lg"
                 >
                   🎉 Winner!
                 </motion.div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="p-8 bg-white text-center">
            <div className="flex justify-center items-center gap-4">
               <Button 
                onClick={startDraw} 
                disabled={isRolling || availablePool.length === 0}
                size="lg"
                className="text-lg px-12 py-4 rounded-full shadow-indigo-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
               >
                 {isRolling ? '抽籤中...' : '開始抽獎'}
               </Button>
               
               {!allowRepeats && (
                 <Button 
                  variant="secondary" 
                  onClick={resetPool}
                  disabled={isRolling || history.length === 0}
                  className="rounded-full px-6 py-4"
                  title="重置名單"
                 >
                   <RefreshCcw className="w-5 h-5" />
                 </Button>
               )}
            </div>
            
            {!allowRepeats && (
              <p className="mt-4 text-sm text-gray-500">
                剩餘可抽人數: <span className="font-bold text-indigo-600">{availablePool.length}</span> / {participants.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar: History */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-700">中獎紀錄</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>尚未有中獎者</p>
              </div>
            ) : (
              history.map((item, idx) => (
                <motion.div 
                  key={`${item.winner.id}-${item.timestamp}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {history.length - idx}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{item.winner.name}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {history.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
               <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-gray-500"
                onClick={() => {
                   if(confirm('清除紀錄?')) setHistory([]);
                }}
              >
                清除紀錄
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};