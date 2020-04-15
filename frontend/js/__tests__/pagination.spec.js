import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import Pagination from '../components/commits/Pagination';

describe('Pagination', () => {
  test('fetch is called when page is changed', () => {
    const fetch = jest.fn();

    const { container } = render(<Pagination fetch={fetch} total={10} />);

    const pages = container.querySelector('.items');
    const total = container.querySelector('.total');
    const options = container.querySelector('.options');

    expect(total.textContent).toBe('Total: 10');
    expect(total.title).toBe('Total');

    expect(options.type).toBe('select-one');
    expect(options.children).toHaveLength(2);
    expect(options.title).toBe('Items por página');

    const [opt1, opt2] = options.children;

    expect(opt1.textContent).toBe('5');
    expect(opt2.textContent).toBe('10');

    expect(pages.children.item(1).textContent).toBe('1');
    expect(pages.children.item(2).textContent).toBe('2');

    fireEvent.click(pages.children.item(2).firstChild);

    expect(fetch.mock.calls).toHaveLength(1);
    expect(fetch.mock.calls[0][0]).toBe(2);
    expect(fetch.mock.calls[0][1]).toBe(5);
  });
});
