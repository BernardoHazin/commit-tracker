import { render } from '@testing-library/react';
import React from 'react';

import Profile from '../components/home/Profile';

const profile = {
  avatar_url: 'img-src',
  name: 'name',
  location: 'location',
};

describe('Profile', () => {
  test('should mount as expected', () => {
    const { container } = render(<Profile profile={profile} />);

    const image = container.querySelector('.image');
    const name = container.querySelector('.name');
    const location = container.querySelector('.location');

    expect(image.alt).toBe('Perfil');
    expect(image.src).toBe(`http://localhost/${profile.avatar_url}`);
    expect(image.title).toBe('Avatar');

    expect(name.textContent).toBe(profile.name);
    expect(name.title).toBe('Nome');

    expect(location.textContent).toBe(profile.location);
    expect(location.title).toBe('Localização');
  });
});
