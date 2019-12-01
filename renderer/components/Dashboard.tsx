import React from 'react';

import { Browse } from './Browse';
import { Frames } from './Frames';
import { Save } from './Save';

import styled from 'styled-components';

const GroupName = styled.div`
    margin-bottom: 8px;
`

const Wrapper = styled.div`
    background: white;
    padding: 8px 16px 16px 16px;
    margin-bottom: 16px;
`

export const Dashboard = () => {
    return (
        <>
            <Wrapper>
                <GroupName>Browse ROM</GroupName>
                <Browse />
            </Wrapper>
            <Wrapper>
                <GroupName>Animation Frames</GroupName>
                <Frames />
            </Wrapper>
            <Wrapper>
                <GroupName />
                <Save />
            </Wrapper>
        </>
    )
}