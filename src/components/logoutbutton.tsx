"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    // Clear localStorage token
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      alert("Logged out successfully");
      window.location.href = "/login";
    } else {
      // Even if API call fails, redirect to login
      window.location.href = "/login";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 hover:bg-zinc-800 transition"
    >
      Logout
    </button>
  );
}
