// Pure mirror of the shift logic in app/api/admin/*/reorder routes.
// Lets lists update instantly on drop, then reconcile with the server.
export function shiftOrder<T extends { id: string; order: number }>(
  rows: T[],
  draggedId: string,
  targetId: string
): T[] {
  const dragged = rows.find((r) => r.id === draggedId);
  const target = rows.find((r) => r.id === targetId);
  if (!dragged || !target || dragged.order === target.order) return rows;

  const isMovingDown = dragged.order < target.order;

  return rows.map((r) => {
    if (r.id === draggedId) return { ...r, order: target.order };
    if (isMovingDown && r.order > dragged.order && r.order <= target.order) {
      return { ...r, order: r.order - 1 };
    }
    if (!isMovingDown && r.order >= target.order && r.order < dragged.order) {
      return { ...r, order: r.order + 1 };
    }
    return r;
  });
}
