"use client";
export default function LogoutButton(){return <button className="logout-button" onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});location.href="/";}}>خروج از حساب</button>}
