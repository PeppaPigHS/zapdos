import electron from 'electron';
import React from 'react';

import styled from 'styled-components';
import { Input, Button } from 'antd';

const ipcRenderer = electron.ipcRenderer || false;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`

const CustomInput = styled(Input)`
    margin-right: 8px;
    width: 100%;
`

export const Browse = () => {
    const onClick = () => {
        if(ipcRenderer) {
            ipcRenderer.sendSync('open-rom')
        }
    }

    return (
        <Row>
            <CustomInput disabled />
            <Button onClick={onClick}>...</Button>
        </Row>
    )
}