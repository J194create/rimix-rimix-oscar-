import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, Clock, CheckCircle2, AlertCircle, Calendar, 
  Send, Lock, RefreshCw, FileArchive, Sliders, ChevronDown, Bell, Check, Sparkles
} from 'lucide-react';
import { TeamRole, ApprovalStatus, ApprovalLog, PublishingTask, MarketingDeliverables } from '../types';

interface TeamWorkflowBarProps {
  deliverables: MarketingDeliverables;
  currentRole: TeamRole;
  onChangeRole: (role: TeamRole) => void;
  approvalStatus: ApprovalStatus;
  onChangeStatus: (status: ApprovalStatus, note?: string) => void;
  approvalLogs: ApprovalLog[];
  onOpenMediaReframer: () => void;
  onOpenVisionStudio: () => void;
  onOpenExportZip: () => void;
}

const DEFAULT_PUBLISHING_TASKS: PublishingTask[] = [
  {
    id: 'task-1',
    title: 'Deliver 3:4 Print Flyer to Venue Print Shop',
    targetTime: '14:00 (2:00 PM)',
    channel: 'print_flyer',
    assignedRole: 'designer',
    completed: false,
    notes: 'Table tent cards, front marquee flyers, and VIP booth inserts.',
  },
  {
    id: 'task-2',
    title: 'Publish 9:16 Story & TikTok Video Teaser',
    targetTime: '17:00 (5:00 PM)',
    channel: 'instagram_story',
    assignedRole: 'creator',
    completed: false,
    notes: 'Tag headlining DJ, use Amharic + English luxury caption, add sticker countdown.',
  },
  {
    id: 'task-3',
    title: 'Upload 16:9 Stage LED Banner to Media Server',
    targetTime: '18:00 (6:00 PM)',
    channel: 'led_banner',
    assignedRole: 'designer',
    completed: false,
    notes: 'Direct feed to Resolume Arena / Stage LED Wall (1920x1080 60Hz).',
  },
  {
    id: 'task-4',
    title: 'VIP Concierge WhatsApp Blast & Table Guestlist Lock',
    targetTime: '21:00 (9:00 PM)',
    channel: 'vip_concierge',
    assignedRole: 'manager',
    completed: false,
    notes: 'Notify VIP table hosts of complimentary cocktail hour and bottle minimums.',
  },
  {
    id: 'task-5',
    title: 'Doors Open: Ladies Free Admission Window Begins',
    targetTime: '22:00 (10:00 PM)',
    channel: 'doors_open',
    assignedRole: 'manager',
    completed: false,
    notes: 'Door host confirmation of dress code and ladies free entry until 11:00 PM.',
  },
];

export const TeamWorkflowBar: React.FC<TeamWorkflowBarProps> = ({
  deliverables,
  currentRole,
  onChangeRole,
  approvalStatus,
  onChangeStatus,
  approvalLogs,
  onOpenMediaReframer,
  onOpenVisionStudio,
  onOpenExportZip,
}) => {
  const [tasks, setTasks] = useState<PublishingTask[]>(DEFAULT_PUBLISHING_TASKS);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [managerNote, setManagerNote] = useState('');

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const roleLabels: Record<TeamRole, { name: string; color: string; desc: string }> = {
    manager: { name: 'Venue Manager', color: '#d4af37', desc: 'Approvals & Final Broadcast Lock' },
    creator: { name: 'Content Creator', color: '#00f0ff', desc: 'Social Captions & Video Stories' },
    designer: { name: 'Graphic Designer', color: '#ffaa00', desc: 'Screen Banners & Aspect Ratios' },
  };

  const statusBadges: Record<ApprovalStatus, { label: string; bg: string; border: string; text: string; icon: React.ElementType }> = {
    draft: {
      label: 'Draft Mode',
      bg: 'bg-[#181822]',
      border: 'border-[#303044]',
      text: 'text-[#9e9eb0]',
      icon: Clock,
    },
    pending_approval: {
      label: 'Pending Manager Approval',
      bg: 'bg-[#00f0ff]/10',
      border: 'border-[#00f0ff]/40',
      text: 'text-[#00f0ff]',
      icon: Send,
    },
    approved: {
      label: 'Approved for Broadcast',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      icon: CheckCircle2,
    },
  };

  const currentBadge = statusBadges[approvalStatus];
  const StatusIcon = currentBadge.icon;

  const handleDownloadCalendarIcs = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//OSCAR Club//Marketing Production Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${tasks
  .map(
    (t, idx) => `BEGIN:VEVENT
UID:oscar-task-${t.id}-${Date.now()}
SUMMARY:[OSCAR Club] ${t.title}
DESCRIPTION:${t.notes} (Assigned to: ${t.assignedRole.toUpperCase()})
STATUS:CONFIRMED
END:VEVENT`
  )
  .join('\n')}
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OSCAR_${deliverables.eventName.replace(/\s+/g, '_')}_Production_Schedule.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#12121a] via-[#0d0d12] to-[#12121a] border border-[#262638] p-4 sm:p-5 shadow-lg flex flex-col gap-4">
      {/* Top Row: Role Switcher & Status Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1c1c29]">
        {/* Left: Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#808092] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            Active Team Role:
          </span>

          <div className="flex items-center gap-1 bg-[#09090d] p-1 rounded-xl border border-[#20202e]">
            {(['manager', 'creator', 'designer'] as const).map((role) => (
              <button
                key={role}
                onClick={() => onChangeRole(role)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  currentRole === role
                    ? 'bg-[#d4af37] text-black font-bold shadow-md'
                    : 'text-[#88889a] hover:text-[#f0f0fa]'
                }`}
                title={roleLabels[role].desc}
              >
                {roleLabels[role].name}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#606072] hidden md:inline">
            ({roleLabels[currentRole].desc})
          </span>
        </div>

        {/* Right: Approval Status Tag & Controls */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${currentBadge.bg} ${currentBadge.border} ${currentBadge.text}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{currentBadge.label}</span>
          </div>

          {/* Workflow Action Buttons */}
          {approvalStatus === 'draft' && (
            <button
              onClick={() => onChangeStatus('pending_approval', 'Submitted by ' + roleLabels[currentRole].name)}
              className="px-3 py-1 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Submit for Approval</span>
            </button>
          )}

          {approvalStatus === 'pending_approval' && currentRole === 'manager' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onChangeStatus('approved', 'Approved by Venue Manager')}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Approve & Lock</span>
              </button>

              <button
                onClick={() => onChangeStatus('draft', 'Manager requested adjustments')}
                className="px-2.5 py-1 rounded-lg bg-[#20202e] hover:bg-[#2c2c3e] text-[#b0b0c2] text-xs transition-colors cursor-pointer"
              >
                Request Revisions
              </button>
            </div>
          )}

          {approvalStatus === 'approved' && currentRole === 'manager' && (
            <button
              onClick={() => onChangeStatus('draft', 'Unlocked for revisions by Manager')}
              className="px-2.5 py-1 rounded-lg bg-[#181822] hover:bg-[#252535] text-xs text-[#9090a2] hover:text-[#f0f0f8] transition-colors cursor-pointer"
            >
              Unlock Draft
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Quick Action Tooling Hub */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Vision Studio Button */}
          <button
            onClick={onOpenVisionStudio}
            className="px-3.5 py-1.5 rounded-xl bg-[#09090e] hover:bg-[#151520] border border-[#00f0ff]/40 text-xs text-[#00f0ff] hover:text-[#7ef4ff] font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Reference Vision & OCR</span>
          </button>

          {/* Aspect Ratio Auto-Re-framing Button */}
          <button
            onClick={onOpenMediaReframer}
            className="px-3.5 py-1.5 rounded-xl bg-[#09090e] hover:bg-[#151520] border border-[#d4af37]/40 text-xs text-[#d4af37] hover:text-[#f7e7b4] font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Re-framing & AI Upscaler (16:9 • 9:16 • 3:4 • 1:1)</span>
          </button>

          {/* Publishing Calendar Toggle */}
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="px-3 py-1.5 rounded-xl bg-[#09090e] hover:bg-[#151520] border border-[#2a2a3c] text-xs text-[#cfcfe2] font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#ffaa00]" />
            <span>Publishing Schedule ({completedCount}/{tasks.length})</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Media Kit Zip Export */}
        <button
          onClick={onOpenExportZip}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c66e] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:brightness-110 flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <FileArchive className="w-3.5 h-3.5 text-black" />
          <span>Multi-Channel Media Kit (.ZIP)</span>
        </button>
      </div>

      {/* Expandable Publishing Calendar & Deadlines Panel */}
      {isCalendarOpen && (
        <div className="rounded-xl bg-[#08080b] border border-[#1f1f2d] p-4 flex flex-col gap-3 mt-1 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#181822] pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ffaa00]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#f5ebd1]">
                Automated Nightlife Publishing Schedule & Production Deadlines
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCalendarIcs}
                className="text-[11px] text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3 h-3" />
                <span>Export .ICS Calendar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                  task.completed
                    ? 'bg-emerald-500/5 border-emerald-500/30 opacity-75'
                    : 'bg-[#0e0e14] border-[#20202e] hover:border-[#38384e]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 transition-colors ${
                    task.completed
                      ? 'bg-emerald-500 text-black'
                      : 'border border-[#444458] bg-[#14141c]'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 font-bold" />}
                </div>

                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        task.completed ? 'text-[#a0a0b2] line-through' : 'text-[#f0f0fa]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#ffaa00] bg-[#ffaa00]/10 px-1.5 py-0.5 rounded">
                      {task.targetTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707084]">{task.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
