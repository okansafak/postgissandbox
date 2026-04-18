import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import SqlEditor from '@/components/editor/SqlEditor';
import SpatialMap from '@/components/map/SpatialMap';
import ResultTable from '@/components/results/ResultTable';
import ExplainPlan from '@/components/results/ExplainPlan';
import LessonContent from '@/components/lesson/LessonContent';

interface LessonLayoutProps {
  day: string;
  module: string;
  lesson: string;
}

export default function LessonLayout({ day, module, lesson }: LessonLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Üst çubuk */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-surface shrink-0">
        <span className="text-xs text-text-muted font-mono uppercase tracking-widest">
          PostGIS Akademi
        </span>
        <span className="text-border">|</span>
        <span className="text-sm text-text">
          Gün {day.replace('day-', '')} / Modül {module.replace('module-', '')} / Ders{' '}
          {lesson.replace('lesson-', '')}
        </span>
      </div>

      {/* Ana 2'li panel: sol içerik, sağ editör+harita */}
      <PanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
        {/* Sol panel: MDX ders içeriği */}
        <Panel
          defaultSize={38}
          minSize={25}
          className="overflow-y-auto bg-surface-2 border-r border-border"
        >
          <LessonContent day={day} module={module} lesson={lesson} />
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary-light transition-colors cursor-col-resize" />

        {/* Sağ panel: editör üstte, harita/tablo altta */}
        <Panel defaultSize={62} minSize={40}>
          <PanelGroup orientation="vertical">
            {/* Sağ üst: SQL editörü */}
            <Panel
              defaultSize={40}
              minSize={20}
              className="overflow-hidden border-b border-border"
            >
              <SqlEditor />
            </Panel>

            <PanelResizeHandle className="h-1 bg-border hover:bg-primary-light transition-colors cursor-row-resize" />

            {/* Sağ alt: Sekmeli panel */}
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
                <TabsContent value="map" className="flex-1 overflow-hidden">
                  <SpatialMap />
                </TabsContent>
                <TabsContent value="table" className="flex-1 overflow-auto p-2">
                  <ResultTable />
                </TabsContent>
                <TabsContent value="explain" className="flex-1 overflow-auto p-2">
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
