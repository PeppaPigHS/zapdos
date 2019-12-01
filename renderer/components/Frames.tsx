import React from 'react';

import { Table, Button } from 'antd';
import styled from 'styled-components'

const Row = styled.div`
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
`

const TableWrapper = styled.div`
    height: 336px;
    padding: 8px;
`

const CustomButton = styled(Button)`
    width: 100%;
`

const columns = [
    {
        title: 'Path',
        dataIndex: 'path',
    }
]

export const Frames = () => {
    return (
        <Col>
            <TableWrapper>
                <Table
                    bordered
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            </TableWrapper>
            <Row>
                <CustomButton style={{ marginRight: '8px' }} >
                    Add Frame
                </CustomButton>
                <CustomButton>
                    Delete Frame
                </CustomButton>
            </Row>
        </Col>
    )
}