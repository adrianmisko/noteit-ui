import React, { FC, useEffect, useState, MouseEvent } from 'react';
import { cleanup, render, fireEvent, act, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectView from '../ProjectView';
import { useStoreState, useStoreActions } from '../../store/hooks';
import { StoreProvider } from 'easy-peasy';
import store from '../../store/store';
import { MemoryRouter } from 'react-router-dom'



describe('ProjectView', () => {

  beforeEach(cleanup);
  it('Runs', () => {});
    it('Renders without crashing', () => {
    render(
    <MemoryRouter initialEntries={["/projects/1"]}>
        <StoreProvider store={store}>
            <ProjectView />
        </StoreProvider>
    </MemoryRouter>

    );
    });
});
