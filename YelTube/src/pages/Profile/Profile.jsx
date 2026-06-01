import "./Profile.css";


const Profile = ()=> {
    const currentUser =JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        return (
            <h2>Please Login</h2>
        );
    }
    return (
        <div className="profile-page">
            <div className="profile-banner">

            </div>
            <div className="profile-content">
                <img src="https://i.pravatar.cc/150" alt="Profile" className="profile-avatar"/>
                <h2>{currentUser.name}</h2>
                <p>{currentUser.email}</p>
                <span>1k Subscribers</span>
                <button>Edit Profile</button>
            </div>

        </div>
    );
};
export default Profile;