import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shuffle, Download, LayoutGrid } from 'lucide-react';
import { Participant, GroupResult } from '../types';
import { Button } from './ui/Button';

interface GroupModuleProps {
  participants: Participant[];
}

export const GroupModule: React.FC<GroupModuleProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<GroupResult[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const generateGroups = () => {
    if (participants.length === 0) return;

    // Fisher-Yates Shuffle
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newGroups: GroupResult[] = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push({
        groupId: newGroups.length + 1,
        members: shuffled.slice(i, i + groupSize)
      });
    }

    setGroups(newGroups);
    setIsGenerated(true);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    // Use Blob for better encoding support
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM
    let csvContent = "Group ID,Name\n";

    groups.forEach(group => {
      group.members.forEach(member => {
        // Handle commas in names by wrapping in quotes
        const safeName = member.name.includes(',') ? `"${member.name}"` : member.name;
        csvContent += `Group ${group.groupId},${safeName}\n`;
      });
    });

    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "grouped_teams.csv");
    document.body.appendChild(link);
    link.click();

    // Clean up with a longer delay (5s) to ensure verify browser file write completion
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">自動分組設定</h2>
            <p className="text-sm text-gray-500">總人數: {participants.length} 人</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <label className="text-sm font-medium text-gray-700 ml-2">每組人數:</label>
          <input
            type="number"
            min="1"
            max={participants.length}
            value={groupSize}
            onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 p-2 border border-gray-300 rounded text-center focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={generateGroups}
            size="lg"
            className="shadow-indigo-200 shadow-md"
            disabled={participants.length === 0}
            title={participants.length === 0 ? "請先新增名單" : "開始進行分組"}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            開始分組
          </Button>
          {isGenerated && (
            <Button variant="secondary" onClick={downloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              匯出 CSV
            </Button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {isGenerated && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <motion.div
              key={group.groupId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-r from-gray-50 to-white p-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Group {group.groupId}</h3>
                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {group.members.map(member => (
                    <li key={member.id} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      {member.name}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isGenerated && (
        <div className="text-center py-20 bg-white/50 rounded-xl border border-dashed border-gray-300">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          {participants.length === 0 ? (
            <div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">尚未有名單資料</h3>
              <p className="text-gray-400">請先至「名單管理」新增人員</p>
            </div>
          ) : (
            <h3 className="text-lg font-medium text-gray-500">準備好後，點擊「開始分組」</h3>
          )}
        </div>
      )}

    </div>
  );
};