import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Stack, IconButton, Chip } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import moment from 'moment';

// ---- Sortable Card ----
function KanbanCard({ sale, onOpen }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sale.id,
    data: { type: 'card', sale },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: 'grab',
  };

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      elevation={2}
      sx={{ p: 1.5 }}
      style={style}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle2" noWrap>
            {sale.name}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onOpen(sale.id)}
            aria-label="open"
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" noWrap>
          {sale.client?.name}
        </Typography>
        {sale.desc ? (
          <Typography
            variant="body2"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {sale.desc}
          </Typography>
        ) : null}
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip size="small" label={sale.stage} />
          <Typography variant="caption" color="text.secondary">
            {moment(sale.createdAt).format('ll')}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

// ---- Column ----
function KanbanColumn({ id, title, items, onOpen }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: 400,
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: (theme) => theme.palette.background.paper,
        p: 1.25,
        width: { xs: 260, sm: 300, md: 320 },
        flex: '0 0 auto', // fixed-width columns
        outline: isOver ? '2px dashed rgba(0,0,0,0.2)' : 'none',
        outlineOffset: -2,
      }}
    >
      <Stack spacing={1.25}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, px: 0.5 }}
          noWrap
        >
          {title}{' '}
          <Typography component="span" variant="body2" color="text.secondary">
            ({items.length})
          </Typography>
        </Typography>

        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1.25}>
            {items.map((sale) => (
              <KanbanCard key={sale.id} sale={sale} onOpen={onOpen} />
            ))}
          </Stack>
        </SortableContext>
      </Stack>
    </Box>
  );
}

// ---- Main Board ----
export default function SalesKanban({
  sales,
  onMove,
  stagesOrder,
  stageLabels,
}) {
  const navigate = useNavigate();

  const orderedStages = useMemo(() => {
    const unique = Array.from(new Set((sales || []).map((s) => s.stage)));
    if (stagesOrder && stagesOrder.length) {
      const extras = unique.filter((s) => !stagesOrder.includes(s));
      return [...stagesOrder, ...extras];
    }
    return unique;
  }, [sales, stagesOrder]);

  const [columns, setColumns] = useState(() => {
    const byStage = {};
    orderedStages.forEach((s) => (byStage[s] = []));
    (sales || []).forEach((sale) => {
      if (!byStage[sale.stage]) byStage[sale.stage] = [];
      byStage[sale.stage].push(sale);
    });
    return byStage;
  });

  React.useEffect(() => {
    const byStage = {};
    orderedStages.forEach((s) => (byStage[s] = []));
    (sales || []).forEach((sale) => {
      if (!byStage[sale.stage]) byStage[sale.stage] = [];
      byStage[sale.stage].push(sale);
    });
    setColumns(byStage);
  }, [sales, orderedStages]);

  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const findStageAndIndex = useCallback(
    (id) => {
      for (const stage of Object.keys(columns)) {
        const idx = columns[stage].findIndex((c) => c.id === id);
        if (idx !== -1) return { stage, index: idx };
      }
      return { stage: null, index: -1 };
    },
    [columns]
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const { stage } = findStageAndIndex(active.id);
    if (!stage) return;
    const card = columns[stage].find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeLoc = findStageAndIndex(active.id);
    let overLoc = findStageAndIndex(over.id);

    if (overLoc.index === -1 && columns[over.id]) {
      overLoc = { stage: over.id, index: columns[over.id].length };
    }

    if (!activeLoc.stage || !overLoc.stage) return;
    if (activeLoc.stage === overLoc.stage && activeLoc.index === overLoc.index)
      return;

    setColumns((prev) => {
      const next = { ...prev };
      const fromItems = [...next[activeLoc.stage]];
      const [moved] = fromItems.splice(activeLoc.index, 1);
      next[activeLoc.stage] = fromItems;

      const toItems = [...next[overLoc.stage]];
      const clampedIndex = Math.max(0, Math.min(overLoc.index, toItems.length));
      toItems.splice(clampedIndex, 0, moved);
      next[overLoc.stage] = toItems;
      return next;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const from = findStageAndIndex(active.id);
    let to = findStageAndIndex(over.id);
    if (to.index === -1 && columns[over.id]) {
      to = { stage: over.id, index: columns[over.id].length - 1 };
    }

    if (from.stage && to.stage && from.stage === to.stage) {
      setColumns((prev) => {
        const next = { ...prev };
        next[from.stage] = arrayMove(next[from.stage], from.index, to.index);
        return next;
      });
      if (onMove) onMove(active.id, to.stage, to.index);
      return;
    }

    if (to.stage && onMove) onMove(active.id, to.stage, to.index);
  };

  const handleOpen = (id) => navigate(`/lead-info/${id}`);

  return (
    <Box
      sx={{
        overflowX: 'auto',
        overflowY: 'hidden',
        py: 2,
        overscrollBehaviorX: 'contain',
      }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* inline-flex keeps children’s intrinsic width and makes THIS box scroll, not the page */}
        <Box
          sx={{
            display: 'inline-flex',
            gap: 2,
            minHeight: 400,
          }}
        >
          <SortableContext
            items={orderedStages}
            strategy={verticalListSortingStrategy}
          >
            {orderedStages.map((stage) => (
              <KanbanColumn
                key={stage}
                id={stage}
                title={stageLabels?.[stage] || stage}
                items={columns[stage] || []}
                onOpen={handleOpen}
              />
            ))}
          </SortableContext>
        </Box>

        <DragOverlay dropAnimation={null}>
          {activeCard ? (
            <Paper elevation={6} sx={{ p: 1.5, width: 100 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" noWrap>
                  {activeCard.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {activeCard.client?.name}
                </Typography>
              </Stack>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}
