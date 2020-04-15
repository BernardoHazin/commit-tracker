import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import Card from '../components/commits/Card';

const commit = {
  sha: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
  project: 'project',
  message: 'message',
  committer: 'commiter',
  date: new Date().toLocaleString(),
};

const { format } = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'full',
  timeStyle: 'medium',
});

describe('Card', () => {
  test('onCardClick is called when card is clicked', () => {
    const onCardClickCallback = jest.fn();

    const { container } = render(<Card commit={commit} onCardClick={onCardClickCallback} />);

    const card = container.querySelector('.card-container');
    const title = container.querySelector('.title');
    const sha = container.querySelector('.sha');
    const message = container.querySelector('.message');
    const committer = container.querySelector('.committer');
    const date = container.querySelector('.date');
    const informative = container.querySelector('.informative');
    const icon = container.querySelector('.icon');

    expect(!!informative).toBe(true);
    expect(!!icon).toBe(true);

    expect(card.classList.contains('animated')).toBe(true);

    expect(title.textContent).toBe(commit.project);
    expect(title.title).toBe('Projeto');

    expect(sha.textContent).toBe(commit.sha);
    expect(sha.title).toBe('ID');

    expect(message.textContent).toBe(commit.message);
    expect(message.title).toBe(commit.message);

    expect(committer.textContent).toBe(`Autor: ${commit.committer}`);
    expect(committer.title).toBe(commit.committer);

    expect(date.textContent).toBe(format(new Date(commit.date)));
    expect(date.title).toBe('Data de criação');

    fireEvent.click(card);

    expect(onCardClickCallback.mock.calls).toHaveLength(1);
    expect(onCardClickCallback.mock.calls[0][0]).toBe(commit);

    fireEvent.keyPress(card);

    expect(onCardClickCallback.mock.calls).toHaveLength(1);
    expect(onCardClickCallback.mock.calls[0][0]).toBe(commit);
  });

  test('onCardClick should not be called when card is static', () => {
    const onCardClickCallback = jest.fn();

    const { container } = render(
      <Card commit={commit} isStatic onCardClick={onCardClickCallback} />
    );

    const card = container.querySelector('.card-container');
    const informative = container.querySelector('.informative');
    const icon = container.querySelector('.icon');

    expect(!!informative).toBe(false);
    expect(!!icon).toBe(false);

    expect(card.classList.contains('animated')).toBe(false);

    fireEvent.click(card);

    expect(onCardClickCallback.mock.calls).toHaveLength(0);
  });
});
