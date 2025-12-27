import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, UserPlus, Trash2, Users, Sparkles, AlertTriangle } from 'lucide-react';
import { Participant } from '../types';
import { Button } from './ui/Button';

interface InputModuleProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onNext: () => void;
}

export const InputModule: React.FC<InputModuleProps> = ({ participants, setParticipants, onNext }) => {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze duplicates
  const nameCounts = useMemo(() => {
    return participants.reduce((acc: Record<string, number>, p) => {
      acc[p.name] = (acc[p.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [participants]);

  const hasDuplicates = Object.values(nameCounts).some((count: number) => count > 1);

  const handleAddText = () => {
    if (!textInput.trim()) return;
    
    const newNames = textInput
      .split(/\n|,/) // Split by newline or comma
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newParticipants: Participant[] = newNames.map(name => ({
      id: crypto.randomUUID(),
      name
    }));

    setParticipants(prev => [...prev, ...newParticipants]);
    setTextInput('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split(/\r\n|\n/);
      
      const newParticipants: Participant[] = [];
      lines.forEach(line => {
        // Simple CSV parsing: assumes first column or just a list of names
        const cleanLine = line.split(',')[0].trim();
        if (cleanLine) {
          newParticipants.push({
            id: crypto.randomUUID(),
            name: cleanLine
          });
        }
      });

      setParticipants(prev => [...prev, ...newParticipants]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const loadDummyData = () => {
    const dummyNames = [
      "王小明", "陳小華", "張美麗", "李建國", "林雅婷",
      "黃志偉", "吳淑芬", "蔡家豪", "楊怡君", "趙士銘",
      "孫佳玲", "周偉倫", "徐秀英", "朱冠宇", "高進",
      "王小明", "林雅婷" // Intentionally added duplicates for demo
    ];
    
    const newParticipants = dummyNames.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    
    setParticipants(prev => [...prev, ...newParticipants]);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueParticipants: Participant[] = [];
    
    participants.forEach(p => {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        uniqueParticipants.push(p);
      }
    });

    setParticipants(uniqueParticipants);
  };

  const clearList = () => {
    if (window.confirm('確定要清空所有名單嗎？')) {
      setParticipants([]);
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            名單管理
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            請輸入姓名或是上傳 CSV 檔案來建立抽籤或分組名單
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Input Methods */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手動輸入 (一行一個，或用逗號分隔)
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="王小明&#10;李大華&#10;陳欣欣"
                className="w-full h-40 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-shadow"
              />
              <div className="mt-2 flex justify-end">
                <Button onClick={handleAddText} disabled={!textInput.trim()}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  加入名單
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">或是</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上傳 CSV 檔案
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50 hover:bg-indigo-50/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      選擇檔案
                    </span>
                    <p className="pl-1">或拖曳至此</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV, TXT up to 10MB</p>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".csv,.txt"
                onChange={handleFileUpload}
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">快速測試</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadDummyData}
                    className="text-indigo-600 hover:bg-indigo-50 border border-dashed border-indigo-200"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    載入模擬名單
                  </Button>
               </div>
            </div>
          </div>

          {/* Right Column: List Preview */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">
                目前名單 ({participants.length} 人)
              </h3>
              <div className="flex items-center gap-2">
                {hasDuplicates && (
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={removeDuplicates} 
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2"
                    title="移除重複的姓名，只保留一筆"
                   >
                    <Trash2 className="w-4 h-4 mr-1" />
                    移除重複
                  </Button>
                )}
                {participants.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearList} className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2">
                    <Trash2 className="w-4 h-4 mr-1" />
                    清空
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 overflow-y-auto max-h-[450px] p-2 space-y-2 relative">
              {participants.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Users className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">尚未加入任何人員</p>
                </div>
              ) : (
                participants.map((p) => {
                  const isDuplicate = nameCounts[p.name] > 1;
                  return (
                    <div 
                      key={p.id} 
                      className={`
                        flex items-center justify-between p-3 rounded shadow-sm border transition-colors group
                        ${isDuplicate ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                         <span className={`font-medium ${isDuplicate ? 'text-orange-800' : 'text-gray-700'}`}>
                           {p.name}
                         </span>
                         {isDuplicate && (
                           <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                             <AlertTriangle className="w-3 h-3 mr-1" />
                             重複
                           </span>
                         )}
                      </div>
                      <button 
                        onClick={() => removeParticipant(p.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        {participants.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <Button onClick={onNext} size="lg" className="px-8 shadow-indigo-200 shadow-lg">
              開始使用功能 &rarr;
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};