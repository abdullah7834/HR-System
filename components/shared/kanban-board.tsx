'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export interface KanbanColumn<T> {
  id: string;
  title: string;
  items: T[];
}

interface KanbanBoardProps<T extends { id: string }> {
  columns: KanbanColumn<T>[];
  onDragEnd: (itemId: string, sourceColumnId: string, destColumnId: string) => void;
  renderCard: (item: T) => React.ReactNode;
}

export function KanbanBoard<T extends { id: string }>({
  columns,
  onDragEnd,
  renderCard,
}: KanbanBoardProps<T>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onDragEnd(result.draggableId, result.source.droppableId, result.destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-72">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-700">{column.title}</h3>
                <span className="text-xs text-slate-500 bg-white px-1.5 py-0.5 rounded">{column.items.length}</span>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[200px]"
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {renderCard(item)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
