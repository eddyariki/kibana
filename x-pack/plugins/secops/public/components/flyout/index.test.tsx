/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { mount } from 'enzyme';
import { set } from 'lodash/fp';
import * as React from 'react';
import { ActionCreator } from 'typescript-fsa';

import { mockGlobalState, TestProviders } from '../../mock';
import { createStore, State } from '../../store';
import { mockDataProviders } from '../timeline/data_providers/mock/mock_data_providers';

import { Flyout, FlyoutComponent, flyoutHeaderHeight } from '.';
import { FlyoutButton } from './button';

const testFlyoutHeight = 980;
const usersViewing = ['elastic'];

describe('Flyout', () => {
  const state: State = mockGlobalState;

  describe('rendering', () => {
    test('it renders the default flyout state as a button', () => {
      const wrapper = mount(
        <TestProviders>
          <Flyout
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            timelineId="test"
            usersViewing={usersViewing}
          />
        </TestProviders>
      );

      expect(
        wrapper
          .find('[data-test-subj="flyoutButton"]')
          .first()
          .text()
      ).toContain('T I M E L I N E');
    });

    test('it renders the title field when its state is set to flyout is true', () => {
      const stateShowIsTrue = set('local.timeline.timelineById.test.show', true, state);
      const storeShowIsTrue = createStore(stateShowIsTrue);

      const wrapper = mount(
        <TestProviders store={storeShowIsTrue}>
          <Flyout
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            timelineId="test"
            usersViewing={usersViewing}
          />
        </TestProviders>
      );

      expect(
        wrapper
          .find('[data-test-subj="timeline-title"]')
          .first()
          .props().placeholder
      ).toContain('Untitled Timeline');
    });

    test('it does NOT render the fly out button when its state is set to flyout is true', () => {
      const stateShowIsTrue = set('local.timeline.timelineById.test.show', true, state);
      const storeShowIsTrue = createStore(stateShowIsTrue);

      const wrapper = mount(
        <TestProviders store={storeShowIsTrue}>
          <Flyout
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            timelineId="test"
            usersViewing={usersViewing}
          />
        </TestProviders>
      );

      expect(wrapper.find('[data-test-subj="flyoutButton"]').exists()).toEqual(false);
    });

    test('it renders the flyout body', () => {
      const stateShowIsTrue = set('local.timeline.timelineById.test.show', true, state);
      const storeShowIsTrue = createStore(stateShowIsTrue);

      const wrapper = mount(
        <TestProviders store={storeShowIsTrue}>
          <Flyout
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            timelineId="test"
            usersViewing={usersViewing}
          >
            <p>Fake flyout body</p>
          </Flyout>
        </TestProviders>
      );

      expect(
        wrapper
          .find('[data-test-subj="eui-flyout-body"]')
          .first()
          .text()
      ).toContain('Fake flyout body');
    });

    test('it does render the data providers badge when the number is greater than 0', () => {
      const stateWithDataProviders = set(
        'local.timeline.timelineById.test.dataProviders',
        mockDataProviders,
        state
      );
      const storeWithDataProviders = createStore(stateWithDataProviders);

      const wrapper = mount(
        <TestProviders store={storeWithDataProviders}>
          <Flyout
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            timelineId="test"
            usersViewing={usersViewing}
          />
        </TestProviders>
      );

      expect(wrapper.find('[data-test-subj="badge"]').exists()).toEqual(true);
    });

    test('it renders the correct number of data providers badge when the number is greater than 0', () => {
      const stateWithDataProviders = set(
        'local.timeline.timelineById.test.dataProviders',
        mockDataProviders,
        state
      );
      const storeWithDataProviders = createStore(stateWithDataProviders);

      const wrapper = mount(
        <TestProviders store={storeWithDataProviders}>
          <Flyout
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            timelineId="test"
            usersViewing={usersViewing}
          />
        </TestProviders>
      );

      expect(
        wrapper
          .find('[data-test-subj="badge"]')
          .first()
          .text()
      ).toContain('10');
    });

    test('it does NOT render the data providers badge when the number is equal to 0', () => {
      const wrapper = mount(
        <TestProviders>
          <Flyout
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            timelineId="test"
            usersViewing={usersViewing}
          />
        </TestProviders>
      );

      expect(wrapper.find('[data-test-subj="badge"]').exists()).toEqual(false);
    });

    test('should call the onOpen when the mouse is clicked for rendering', () => {
      const showTimeline = (jest.fn() as unknown) as ActionCreator<{ id: string; show: boolean }>;
      const wrapper = mount(
        <TestProviders>
          <FlyoutComponent
            dataProviders={mockDataProviders}
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            show={false}
            showTimeline={showTimeline}
            timelineId="test"
            usersViewing={usersViewing}
          />
        </TestProviders>
      );

      wrapper
        .find('[data-test-subj="flyoutOverlay"]')
        .first()
        .simulate('click');

      expect(showTimeline).toBeCalled();
    });

    test('should call the onClose when the close button is clicked', () => {
      const stateShowIsTrue = set('local.timeline.timelineById.test.show', true, state);
      const storeShowIsTrue = createStore(stateShowIsTrue);

      const showTimeline = (jest.fn() as unknown) as ActionCreator<{ id: string; show: boolean }>;
      const wrapper = mount(
        <TestProviders store={storeShowIsTrue}>
          <FlyoutComponent
            dataProviders={mockDataProviders}
            flyoutHeight={testFlyoutHeight}
            headerHeight={flyoutHeaderHeight}
            show={true}
            showTimeline={showTimeline}
            timelineId="test"
            usersViewing={usersViewing}
          />
        </TestProviders>
      );

      wrapper
        .find('[data-test-subj="close-timeline"] button')
        .first()
        .simulate('click');

      expect(showTimeline).toBeCalled();
    });
  });

  describe('showFlyoutButton', () => {
    test('should show the flyout button when show is true', () => {
      const openMock = jest.fn();
      const wrapper = mount(
        <TestProviders>
          <FlyoutButton
            dataProviders={mockDataProviders}
            show={true}
            timelineId="test"
            onOpen={openMock}
          />
        </TestProviders>
      );
      expect(wrapper.find('[data-test-subj="flyoutButton"]').exists()).toEqual(true);
    });

    test('should NOT show the flyout button when show is false', () => {
      const openMock = jest.fn();
      const wrapper = mount(
        <TestProviders>
          <FlyoutButton
            dataProviders={mockDataProviders}
            show={false}
            timelineId="test"
            onOpen={openMock}
          />
        </TestProviders>
      );
      expect(wrapper.find('[data-test-subj="flyoutButton"]').exists()).toEqual(false);
    });

    test('should return the flyout button with text', () => {
      const openMock = jest.fn();
      const wrapper = mount(
        <TestProviders>
          <FlyoutButton
            dataProviders={mockDataProviders}
            show={true}
            timelineId="test"
            onOpen={openMock}
          />
        </TestProviders>
      );
      expect(
        wrapper
          .find('[data-test-subj="flyoutButton"]')
          .first()
          .text()
      ).toContain('T I M E L I N E');
    });

    test('should call the onOpen when it is clicked', () => {
      const openMock = jest.fn();
      const wrapper = mount(
        <TestProviders>
          <FlyoutButton
            dataProviders={mockDataProviders}
            show={true}
            timelineId="test"
            onOpen={openMock}
          />
        </TestProviders>
      );
      wrapper
        .find('[data-test-subj="flyoutOverlay"]')
        .first()
        .simulate('click');

      expect(openMock).toBeCalled();
    });
  });
});
