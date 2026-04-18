import { useRef, useState } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import SqlEditor from '@/components/editor/SqlEditor';
import SpatialMap from '@/components/map/SpatialMap';
import ResultTable from '@/components/results/ResultTable';
import ExplainPlan from '@/components/results/ExplainPlan';
import LessonContent from '@/components/lesson/LessonContent';
import CurriculumSidebar from '@/components/lesson/CurriculumSidebar';

interface LessonLayoutProps {
  day: string;
  module: string;
  lesson: string;
}

export default function LessonLayout({ day, module, lesson }: LessonLayoutProps) {
  const sidebarRef = useRef<ImperativePanelHandle>(null);
  const [collapsed, setCollapsed] = useState(false);

  function toggleSidebar() {
    if (collapsed) {
      sidebarRef.current?.expand();
    } else {
      sidebarRef.current?.collapse();
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Üst çubuk */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface shrink-0">
        <button
          onClick={toggleSidebar}
          title={collapsed ? 'Menüyü aç' : 'Menüyü kapat'}
          className="p-1 rounded text-text-muted hover:text-text hover:bg-surface-2 transition-colors shrink-0"
        >
          {collapsed ? '☰' : '✕'}
        </button>
        <span className="text-xs text-text-muted font-mono uppercase tracking-widest">
          PostGIS Akademi
        </span>
        <span className="text-border">|</span>
        <span className="text-sm text-text">
          Gün {day.replace('day-', '')} / Modül {module.replace('module-', '')} / Ders{' '}
          {lesson.replace('lesson-', '')}
        </span>
      </div>

      {/* Ana 3'lü panel: sidebar | içerik | editör+harita */}
      <PanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
        {/* Sidebar: müfredat navigasyonu */}
        <Panel
          ref={sidebarRef}
          defaultSize={18}
          minSize={14}
          maxSize={30}
          collapsible
          collapsedSize={0}
          onCollapse={() => setCollapsed(true)}
          onExpand={() => setCollapsed(false)}
          className="border-r border-border overflow-hidden"
        >
          <CurriculumSidebar />
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary-light transition-colors cursor-col-resize" />

        {/* Orta panel: MDX ders içeriği */}
        <Panel
          defaultSize={34}
          minSize={22}
          className="overflow-y-auto bg-surface-2 border-r border-border"
        >
          <LessonContent day={day} module={module} lesson={lesson} />
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary-light transition-colors cursor-col-resize" />

        {/* Sağ panel: editör üstte, harita/tablo altta */}
        <Panel defaultSize={48} minSize={35}>
          <PanelGroup orientation="vertical">
            <Panel
              defaultSize={40}
              minSize={20}
              className="overflow-hidden border-b border-border"
            >
              <SqlEditor />
            </Panel>

            <PanelResizeHandle className="h-1 bg-border hover:bg-primary-light transition-colors cursor-row-resize" />

            <Panel defaultSize={60} minSize={20} className="overflow-hidden">
              <Tabs defaultValue="map" className="h-full flex flex-col">
                <TabsList className="flex gap-0 border-b border-border bg-surface shrink-0">
                  {(['map', 'table', 'explain'] as const).map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="px-4 py-2 text-sm text-text-muted data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent hover:text-text transition-colors"
                    >
                      {tab === 'map' ? '🗺 Harita' : tab === 'table' ? '📋 Tablo' : '🔍 EXPLAIN'}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent
                  value="map"
                  className="flex-1 overflow-hidden data-[state=inactive]:hidden"
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <SpatialMap />
                </TabsContent>
                <TabsContent
                  value="table"
                  className="flex-1 overflow-auto p-2 data-[state=inactive]:hidden"
                >
                  <ResultTable />
                </TabsContent>
                <TabsContent
                  value="explain"
                  className="flex-1 overflow-auto p-2 data-[state=inactive]:hidden"
                >
                  <ExplainPlan />
                </TabsContent>
              </Tabs>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
