import React from "react";
import "./UserDetail.css"; // Create this CSS file for styling

const user = {
  name: "Sandesh Khilari",
  email: "sandesh@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Springfield, USA",
  memberSince: "January 2022",
  profilePic: "https://media.licdn.com/dms/image/v2/D4D03AQE1MxGtHM2S4w/profile-displayphoto-shrink_400_400/B4DZcQelEYHMAk-/0/1748328143204?e=1756944000&v=beta&t=oPhm3xK6hmou_dsLe48VAFxilQFdFv7q1zUlnNZtSq0", // Replace with actual image or avatar
};

const UserDetail = () => {
  return (
    <div className="user-dashboard">
      <div className="user-profile">
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
        <div className="user-info">
          <h2>{user.name}</h2>
          <p>Member since: {user.memberSince}</p>
        </div>
      </div>
      <div className="user-details">
        <h3>Account Details</h3>
        <ul className="user-details-list">
          <li><strong>Email:</strong> {user.email}</li>
          <li><strong>Phone:</strong> {user.phone}</li>
          <li><strong>Address:</strong> {user.address}</li>
        </ul>
      </div>
      <div className="user-actions">
        <button>Edit Profile</button>
        <button>Order History</button>
        <button>Sign Out</button>
      </div>
    </div>
  );
};

export default UserDetail;