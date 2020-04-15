import PropTypes from 'prop-types';
import React from 'react';

const Profile = ({ profile }) => {
  return (
    <div className="profile-container col ac">
      <img alt="Perfil" className="image" src={profile.avatar_url} title="Avatar" />
      <p className="name mt-2" title="Nome">
        {profile.name}
      </p>
      <p className="location" title="Localização">
        {profile.location}
      </p>
    </div>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default Profile;
