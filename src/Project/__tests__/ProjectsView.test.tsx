import React, { FC, useEffect, useState, MouseEvent } from 'react';
import { cleanup, render, fireEvent, act, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectsView from '../ProjectsView';
import { useStoreState, useStoreActions } from '../../store/hooks';
import { StoreProvider } from 'easy-peasy';
import store from '../../store/store';
import { MemoryRouter } from 'react-router-dom'
// @ts-ignore
import { fakeServer } from 'sinon';
import HOSTNAME from '../../config';


describe('ProjectsView', () => {
    
    beforeEach(cleanup);

    it('Renders without crashing', () => {
        render(
        <MemoryRouter initialEntries={["/projects"]}>
            <StoreProvider store={store}>
                <ProjectsView />
            </StoreProvider>
        </MemoryRouter>

        );
    });
    /*
    it('Contains list of projects', async () => {
        
        const url = `${HOSTNAME}/api/projects`;
        let server = fakeServer.create();

        server.respondWith('GET', url, [
            200,
            {},
            JSON.stringify([{"id":1,"name":"Project 1"},{"id":2,"name":"Project 2"},{"id":3,"name":"Project 3"}]),
        ]);
        
        const { getByTestId } = await render(
            <MemoryRouter initialEntries={["/projects"]}>
                <StoreProvider store={store}>
                    <ProjectsView />
                </StoreProvider>
            </MemoryRouter>)
        const container = getByTestId("projectsGrid");
        expect(container.children.length).toBe(3);
        server.restore();
        });
    */
});
