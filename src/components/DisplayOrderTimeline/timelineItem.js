import React, { Component } from 'react';
import { render } from '@testing-library/react';

const statusList = ['Order Received', 'Preparation', 'Delivery', 'Service', 'Order Complete'];



// const TimelineItem = ({ itemIndex, status }) => (
//   <div className="timeline-item">
//       <div className="timeline-item-content">
//         <span className="tag"></span>
//         <p>{itemIndex}</p>
//         {/* {if(statusList.indexof(itemIndex) <= statusList.indexof(status)){
//           <p>Read now</p>
//         }} */}
//         <span className="circle" />
//       </div>
//   </div>
// );

class TimelineItemBase extends Component{
  render(){
    return(
      <div className="timeline-item">
        <div className="timeline-item-content">
          <span className="tag"></span>
          <p>{itemIndex}</p>
          {/* {if(statusList.indexof(itemIndex) <= statusList.indexof(status)){
            <p>Read now</p>
          }} */}
          <span className="circle" />
        </div>
      </div>
    );
  }
}

const TimelineItem = TimelineItemBase;

export default TimelineItem;