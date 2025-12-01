import React from "react";

const Dashboard = () => {
  return (
    <div className="content-wrapper">
      <div className="text-blocks">
        <h1>هوشیار !</h1>
        <h3>برنامه ریزی کن</h3>
      </div>
      <div className="task-blocks">
        {/* Task, Meeting, Action Blocks */}
        <div className="block">
          <h4>قرار های پیش رو</h4>
          <p>Content goes here</p>
        </div>
        <div className="block">
          <h4>کار های پیش رو</h4>
          <p>Content goes here</p>
        </div>
        <div className="block">
          <h4>به پایان رسیده</h4>
          <p>Content goes here</p>
        </div>
      </div>

      <div className="today-plan">
        {/* Today's Plan */}
        <h3>برنامه امروز من:</h3>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
