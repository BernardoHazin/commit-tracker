import PropTypes from 'prop-types';
import React from 'react';

const Profile = ({ profile }) => {
  return (
    <div className="profile-container col ac">
      <img alt="Profile" className="image" src={profile.avatar_url} />
      <p className="mt-2">{profile.name}</p>
      <p className="location">{profile.location}</p>
    </div>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default Profile;
