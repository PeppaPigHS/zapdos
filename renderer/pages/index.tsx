import React from 'react';
import Head from 'next/head';

import { Dashboard } from '../components/Dashboard'

import 'antd/dist/antd.css';

import { Layout } from 'antd';
import styled from 'styled-components';

const { Header, Content, Footer } = Layout;

const CustomLayout = styled(Layout)`
  min-height: 100vh;
`

const CustomHeader = styled(Header)`
  position: fixed;
  z-index: 100;
  width: 100%;
  display: flex;
  flex-direction: row;
`

const CustomContent = styled(Content)`
  padding: 16px;
  margin-top: 64px;
`

const CustomFooter = styled(Footer)`
  text-align: center;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Home = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Zapdos @PeppaPigHS</title>
      </Head>
      <CustomLayout>
        <CustomHeader>
          <img
            src='/static/zapdos.png'
            style={{ marginRight: '15px' }}
          />
          <h1 style={{ color: 'white' }}>
            Zapdos
          </h1>
        </CustomHeader>
        <CustomContent>
          <Dashboard />
        </CustomContent>
        <CustomFooter>
          PeppaPigHS © 2019
        </CustomFooter>
      </CustomLayout>
    </React.Fragment>
  );
};

export default Home;
