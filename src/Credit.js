import React from "react";
import Footer from "./Footer";
import SideBar from "./Sidebar";

function Credit() {
  return (
    <div id='outer-container' >
      <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      <div id='page-wrap' style={{ width: '80%', height: '100%' }}>
        <center>
          <h3>จัดทำโดย</h3>
          <h1>
             ปุณณภพ  รุจิรา  นฤมล
          </h1>
        </center>
      </div>
    </div>
  );
}
export default Credit