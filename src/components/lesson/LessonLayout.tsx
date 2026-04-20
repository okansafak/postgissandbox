import { useState } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Menu, MapPin, Table, Lightning } from '@/components/ui/Icons';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-full flex flex-col">
      {/* Üst çubuk */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface shrink-0">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          className="p-1.5 rounded text-text-muted hover:text-text hover:bg-surface-2 transition-colors shrink-0 text-base leading-none"
        >
          <Menu size={16} />
        </button>
        <span className="text-xs text-text-muted font-mono uppercase tracking-widest">
          PostGIS Akademi
        </span>
        <span className="text-border">|</span>
        <span className="text-sm text-text">
          Bölüm {day.replace('day-', '')} / Modül {module.replace('module-', '')} / Ders{' '}
          {lesson.replace('lesson-', '')}
        </span>
      </div>

      {/* Gövde: sidebar + paneller yan yana */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: CSS ile genişlik kontrolü */}
        <aside
          style={{ width: sidebarOpen ? '220px' : '0px', minWidth: sidebarOpen ? '220px' : '0px' }}
          className="shrink-0 overflow-hidden border-r border-border bg-surface transition-all duration-200"
        >
          <div className="w-[220px] h-full">
            <CurriculumSidebar />
          </div>
        </aside>

        {/* Sağ: 2'li yeniden boyutlandırılabilir panel */}
        <PanelGroup orientation="horizontal" className="flex-1 overflow-hidden bg-surface">
          {/* Orta: MDX içerik */}
          <Panel
            defaultSize={40}
            minSize={25}
            className="overflow-y-auto bg-surface-2 border-r border-border"
            style={{ boxShadow: 'inset -1px 0 0 var(--color-border-strong)' }}
          >
            <LessonContent day={day} module={module} lesson={lesson} />
          </Panel>

          <PanelResizeHandle className="panel-divider-v hover:opacity-90 transition-opacity cursor-col-resize" />

          {/* Sağ: editör + harita/tablo */}
          <Panel defaultSize={60} minSize={40}>
            <PanelGroup orientation="vertical">
              <Panel
                defaultSize={40}
                minSize={20}
                className="overflow-hidden border-b border-border"
                style={{ boxShadow: 'inset 0 -1px 0 var(--color-border-strong)' }}
              >
                <SqlEditor />
              </Panel>

              <PanelResizeHandle className="panel-divider-h hover:opacity-90 transition-opacity cursor-row-resize" />

              <Panel defaultSize={60} minSize={20} className="overflow-hidden">
                <Tabs defaultValue="map" className="h-full flex flex-col">
                  <TabsList className="flex gap-0 border-b border-border bg-surface shrink-0">
                    {(['map', 'table', 'explain'] as const).map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="px-4 py-2 text-sm text-text-muted data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent hover:text-text transition-colors"
                      >
                        {tab === 'map'
                          ? <span className="flex items-center gap-1.5"><MapPin size={13} /> Harita</span>
                          : tab === 'table'
                          ? <span className="flex items-center gap-1.5"><Table size={13} /> Tablo</span>
                          : <span className="flex items-center gap-1.5"><Lightning size={13} /> EXPLAIN</span>
                        }
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent
                    value="map"
                    className="flex-1 overflow-hidden flex flex-col data-[state=inactive]:hidden"
                  >
                    <SpatialMap />
                  </TabsContent>
                  <TabsContent
                    value="table"
                    className="flex-1 overflow-auto p-2 mt-0 data-[state=inactive]:hidden"
                  >
                    <ResultTable />
                  </TabsContent>
                  <TabsContent
                    value="explain"
                    className="flex-1 overflow-auto p-2 mt-0 data-[state=inactive]:hidden"
                  >
                    <ExplainPlan />
                  </TabsContent>
                </Tabs>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
