import React from 'react';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

type Props = {
    onToggleSidebar: () => void;
    userName?: string;
  };

const BarTool:  React.FC<Props> = ({ onToggleSidebar, userName = "Youness AIT HADDOU" }) => {

    const leftContents = (
        <React.Fragment>
           <Button icon="pi pi-bars" severity="success" onClick={onToggleSidebar} />
        </React.Fragment>
    );

  
    const rightContents = (
        <React.Fragment>
            <p className='mx-9'><span className="pi pi-user"></span> Youness AIT HADDOU</p>
            <Button label="Loggout" severity='success' icon="pi pi-arrow-circle-right" />
        </React.Fragment>
    );

    return (
        <Toolbar  right={rightContents} left={leftContents}/>
    );
};

export default BarTool;