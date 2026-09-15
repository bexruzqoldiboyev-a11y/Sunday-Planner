import { Fragment } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TimelineCard, TransportRow } from './TimelineCard.jsx';

/** Kun rejasi — soat relsi boʻylab. */
export function Timeline({ items, onSwap, onDetails, onMap }) {
  return (
    <section className="timeline">
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <TransportRow transport={item.transport} />
            <TimelineCard
              item={item}
              index={index}
              isLast={index === items.length - 1}
              onSwap={onSwap}
              onDetails={onDetails}
              onMap={onMap}
            />
          </Fragment>
        ))}
      </AnimatePresence>
    </section>
  );
}
