import React from 'react';


const TimelineItem = ({ data }) => (
  <div className="timeline-item">
      <div className="timeline-item-content">
        <span className="tag"></span>
        <p>{data}</p>
        <span className="circle" />
      </div>
  </div>
);

export default TimelineItem;