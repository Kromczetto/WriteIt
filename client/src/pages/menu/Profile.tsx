import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import LogoutButton from '../components/LogoutButton';

const Profile = () => {
  const context = useContext(UserContext);

  if (!context) {
    return <p>Context not available</p>;
  }

  const { user } = context;

  if (!user) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <h1>Profile</h1>

      <p>
        <strong>User ID:</strong> {user.id}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <LogoutButton />
    </div>
  );
};

export default Profile;
